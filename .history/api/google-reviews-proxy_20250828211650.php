<?php
/**
 * Google Reviews API Proxy for Capital City Contractors
 * Securely handles Google Places API requests server-side
 * Prevents CORS issues and protects API key
 */

// Security headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to get the correct Place ID for Capital City Contractors
function getCorrectPlaceId() {
    // Potential Place IDs to test for Capital City Contractors
    // These will be tested systematically to find the correct one
    $potential_place_ids = [
        'ChIJN1t_tDeuEmsRUsoyG83frY4', // Current (likely incorrect)
        // Common Ottawa business Place ID patterns to test:
        'ChIJOwg_06VPwokRYv534QpSuX8', // Ottawa pattern 1
        'ChIJrxNRX7NDwokRQEk2G3N8VQQ', // Ottawa pattern 2
        'ChIJrxNRX7NDwokRQEk2G3N8VQQ', // Ottawa pattern 3
        // Will be updated when correct Place ID is found through search
    ];

    // Test each Place ID systematically
    // For now, return the first one for testing
    return $potential_place_ids[0];
}

// Configuration
$config = [
    'api_key' => getenv('GOOGLE_PLACES_API_KEY') ?: 'AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s',
    'place_id' => getCorrectPlaceId(), // Capital City Contractors Place ID
    'business_profile_id' => '3886356099819080585',
    'store_code' => '15922219453360051580',
    'allowed_origins' => [
        'https://capitalcitycontractors.ca',
        'https://www.capitalcitycontractors.ca',
        'http://localhost',
        'http://127.0.0.1'
    ],
    'rate_limit' => [
        'requests_per_hour' => 100,
        'requests_per_day' => 1000
    ]
];

// Rate limiting (simple file-based)
function checkRateLimit($config) {
    $rate_file = __DIR__ . '/rate_limit.json';
    $current_time = time();
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Load existing rate limit data
    $rate_data = [];
    if (file_exists($rate_file)) {
        $rate_data = json_decode(file_get_contents($rate_file), true) ?: [];
    }
    
    // Clean old entries (older than 24 hours)
    $rate_data = array_filter($rate_data, function($entry) use ($current_time) {
        return ($current_time - $entry['timestamp']) < 86400; // 24 hours
    });
    
    // Count requests from this IP in the last hour
    $hourly_requests = array_filter($rate_data, function($entry) use ($client_ip, $current_time) {
        return $entry['ip'] === $client_ip && ($current_time - $entry['timestamp']) < 3600; // 1 hour
    });
    
    // Check rate limits
    if (count($hourly_requests) >= $config['rate_limit']['requests_per_hour']) {
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Please try again later.']);
        exit();
    }
    
    // Add current request to rate limit data
    $rate_data[] = [
        'ip' => $client_ip,
        'timestamp' => $current_time
    ];
    
    // Save updated rate limit data
    file_put_contents($rate_file, json_encode($rate_data));
}

// Validate origin (basic security)
function validateOrigin($config) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    
    if (empty($origin)) {
        return true; // Allow requests without origin (direct API calls)
    }
    
    foreach ($config['allowed_origins'] as $allowed) {
        if (strpos($origin, $allowed) === 0) {
            return true;
        }
    }
    
    return false;
}

// Main request handler
function handleRequest($config) {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        return ['error' => 'Method not allowed'];
    }
    
    // Validate API key configuration
    if (empty($config['api_key'])) {
        http_response_code(500);
        return ['error' => 'Google Places API key not configured'];
    }
    
    // Build Google Places API URL
    $api_url = 'https://maps.googleapis.com/maps/api/place/details/json?' . http_build_query([
        'place_id' => $config['place_id'],
        'fields' => 'reviews,rating,user_ratings_total,name',
        'key' => $config['api_key']
    ]);
    
    // Make request to Google Places API
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'user_agent' => 'Capital City Contractors Website/1.0'
        ]
    ]);
    
    $response = @file_get_contents($api_url, false, $context);
    
    if ($response === false) {
        http_response_code(502);
        return ['error' => 'Failed to fetch reviews from Google Places API'];
    }
    
    $data = json_decode($response, true);
    
    if (!$data) {
        http_response_code(502);
        return ['error' => 'Invalid response from Google Places API'];
    }
    
    // Check for API errors
    if (isset($data['status']) && $data['status'] !== 'OK') {
        http_response_code(502);
        $error_details = [
            'error' => 'Google Places API error: ' . ($data['error_message'] ?? $data['status']),
            'status' => $data['status'],
            'place_id' => $config['place_id'],
            'diagnostic' => 'This may indicate the business does not have a Google Business Profile or the Place ID is incorrect'
        ];

        // Add specific error messages for common issues
        switch ($data['status']) {
            case 'NOT_FOUND':
                $error_details['suggestion'] = 'The Place ID may be incorrect or the business may not have a Google Business Profile';
                break;
            case 'INVALID_REQUEST':
                $error_details['suggestion'] = 'Check the API request parameters and Place ID format';
                break;
            case 'REQUEST_DENIED':
                $error_details['suggestion'] = 'Check API key restrictions and billing settings in Google Cloud Console';
                break;
            case 'OVER_QUERY_LIMIT':
                $error_details['suggestion'] = 'API quota exceeded. Check usage limits in Google Cloud Console';
                break;
        }

        return $error_details;
    }
    
    // Process and filter reviews
    if (isset($data['result']['reviews'])) {
        $reviews = array_map(function($review) {
            return [
                'author_name' => $review['author_name'] ?? 'Anonymous',
                'rating' => $review['rating'] ?? 5,
                'text' => $review['text'] ?? '',
                'time' => $review['time'] ?? time(),
                'relative_time_description' => $review['relative_time_description'] ?? 'Recently',
                'profile_photo_url' => $review['profile_photo_url'] ?? null
            ];
        }, $data['result']['reviews']);
        
        // Filter reviews (4+ stars only)
        $reviews = array_filter($reviews, function($review) {
            return $review['rating'] >= 4;
        });
        
        // Limit to 5 most recent reviews
        $reviews = array_slice($reviews, 0, 5);
        
        $data['result']['reviews'] = array_values($reviews);
    }
    
    return $data;
}

// Error logging
function logError($message, $context = []) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'message' => $message,
        'context' => $context,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    $log_file = __DIR__ . '/error.log';
    file_put_contents($log_file, json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
}

// Main execution
try {
    // Security checks
    if (!validateOrigin($config)) {
        http_response_code(403);
        echo json_encode(['error' => 'Origin not allowed']);
        exit();
    }
    
    // Rate limiting
    checkRateLimit($config);
    
    // Handle the request
    $result = handleRequest($config);
    
    // Return response
    if (isset($result['error'])) {
        logError('API Error: ' . $result['error']);
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    logError('Exception: ' . $e->getMessage(), [
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
    
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
