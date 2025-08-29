<?php
/**
 * Google Places API Test Script
 * Tests the API key and Place ID to diagnose review fetching issues
 */

// Secure Configuration - Load from environment variables
$api_key = getenv('GOOGLE_PLACES_API_KEY');
$secret_key = getenv('GOOGLE_PLACES_SECRET_KEY');
$place_id = 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Current Place ID being used

// Security check
if (!$api_key || !$secret_key) {
    echo "<h2 style='color: red;'>🔐 Security Configuration Required</h2>\n";
    echo "<p>API keys must be configured as environment variables for security.</p>\n";
    echo "<p>Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACES_SECRET_KEY environment variables.</p>\n";
    exit;
}

// Business Profile Information provided
$business_profile_id = '3886356099819080585';
$store_code = '15922219453360051580';

echo "<h2>Google Places API Test for Capital City Contractors</h2>\n";
echo "<p><strong>Testing API Key:</strong> " . substr($api_key, 0, 10) . "...</p>\n";
echo "<p><strong>Current Place ID:</strong> $place_id</p>\n";
echo "<p><strong>Business Profile ID:</strong> $business_profile_id</p>\n";
echo "<p><strong>Store Code:</strong> $store_code</p>\n";

// Test 1: Basic Place Details
echo "<h3>Test 1: Basic Place Details</h3>\n";
$basic_url = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
    'place_id' => $place_id,
    'fields' => 'name,formatted_address,rating,user_ratings_total',
    'key' => $api_key
]);

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 10,
        'user_agent' => 'Capital City Contractors Test/1.0'
    ]
]);

$response = @file_get_contents($basic_url, false, $context);

if ($response === false) {
    echo "<p style='color: red;'>❌ Failed to connect to Google Places API</p>\n";
    echo "<p>Error: " . error_get_last()['message'] . "</p>\n";
} else {
    $data = json_decode($response, true);
    echo "<p style='color: green;'>✅ API Connection Successful</p>\n";
    echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>\n";
    
    if (isset($data['status'])) {
        echo "<p><strong>API Status:</strong> " . $data['status'] . "</p>\n";
        
        if ($data['status'] === 'OK' && isset($data['result'])) {
            echo "<p style='color: green;'>✅ Place found: " . ($data['result']['name'] ?? 'Unknown') . "</p>\n";
            echo "<p><strong>Address:</strong> " . ($data['result']['formatted_address'] ?? 'Not available') . "</p>\n";
            echo "<p><strong>Rating:</strong> " . ($data['result']['rating'] ?? 'Not available') . "</p>\n";
            echo "<p><strong>Total Reviews:</strong> " . ($data['result']['user_ratings_total'] ?? 'Not available') . "</p>\n";
        } else {
            echo "<p style='color: red;'>❌ Place not found or API error</p>\n";
            if (isset($data['error_message'])) {
                echo "<p><strong>Error:</strong> " . $data['error_message'] . "</p>\n";
            }
        }
    }
}

// Test 2: Reviews Fetch
echo "<h3>Test 2: Reviews Fetch</h3>\n";
$reviews_url = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
    'place_id' => $place_id,
    'fields' => 'reviews,rating,user_ratings_total,name',
    'key' => $api_key
]);

$response2 = @file_get_contents($reviews_url, false, $context);

if ($response2 === false) {
    echo "<p style='color: red;'>❌ Failed to fetch reviews</p>\n";
} else {
    $data2 = json_decode($response2, true);
    echo "<p style='color: green;'>✅ Reviews API Call Successful</p>\n";
    
    if (isset($data2['result']['reviews'])) {
        $reviews = $data2['result']['reviews'];
        echo "<p><strong>Reviews Found:</strong> " . count($reviews) . "</p>\n";
        
        foreach ($reviews as $i => $review) {
            echo "<div style='border: 1px solid #ccc; margin: 10px 0; padding: 10px;'>\n";
            echo "<p><strong>Review " . ($i + 1) . ":</strong></p>\n";
            echo "<p><strong>Author:</strong> " . ($review['author_name'] ?? 'Anonymous') . "</p>\n";
            echo "<p><strong>Rating:</strong> " . ($review['rating'] ?? 'N/A') . " stars</p>\n";
            echo "<p><strong>Text:</strong> " . substr($review['text'] ?? 'No text', 0, 200) . "...</p>\n";
            echo "<p><strong>Time:</strong> " . ($review['relative_time_description'] ?? 'Unknown') . "</p>\n";
            echo "</div>\n";
        }
    } else {
        echo "<p style='color: orange;'>⚠️ No reviews found in API response</p>\n";
        echo "<pre>" . json_encode($data2, JSON_PRETTY_PRINT) . "</pre>\n";
    }
}

// Test 3: Search for Capital City Contractors (Multiple Variations)
echo "<h3>Test 3: Search for Capital City Contractors</h3>\n";

$search_queries = [
    'Capital City Contractors Ottawa Ontario',
    'Capital City Contractors Ottawa',
    'Capital City Contractors painting Ottawa',
    'Capital City Contractors renovation Ottawa',
    'painting contractors Ottawa Capital City',
    '613-301-1311 Ottawa contractor',
    'Capital City Contractors 613-301-1311',
    'painting drywall Ottawa Capital City'
];

foreach ($search_queries as $index => $query) {
    echo "<h4>Search " . ($index + 1) . ": '$query'</h4>\n";

    $search_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?" . http_build_query([
        'query' => $query,
        'key' => $api_key
    ]);

    $response3 = @file_get_contents($search_url, false, $context);

    if ($response3 === false) {
        echo "<p style='color: red;'>❌ Failed to search for '$query'</p>\n";
    } else {
        $data3 = json_decode($response3, true);
        echo "<p style='color: green;'>✅ Search API Call Successful</p>\n";

        if (isset($data3['results']) && count($data3['results']) > 0) {
            echo "<p><strong>Search Results Found:</strong> " . count($data3['results']) . "</p>\n";

            foreach ($data3['results'] as $i => $result) {
                echo "<div style='border: 1px solid #ccc; margin: 10px 0; padding: 10px;'>\n";
                echo "<p><strong>Result " . ($i + 1) . ":</strong></p>\n";
                echo "<p><strong>Name:</strong> " . ($result['name'] ?? 'Unknown') . "</p>\n";
                echo "<p><strong>Address:</strong> " . ($result['formatted_address'] ?? 'Unknown') . "</p>\n";
                echo "<p><strong>Place ID:</strong> <code>" . ($result['place_id'] ?? 'Unknown') . "</code></p>\n";
                echo "<p><strong>Rating:</strong> " . ($result['rating'] ?? 'N/A') . " (" . ($result['user_ratings_total'] ?? 0) . " reviews)</p>\n";
                echo "<p><strong>Types:</strong> " . implode(', ', $result['types'] ?? []) . "</p>\n";
                echo "</div>\n";
            }
        } else {
            echo "<p style='color: orange;'>⚠️ No search results found for '$query'</p>\n";
        }
    }
    echo "<hr>\n";
}

echo "<h3>Diagnosis Summary</h3>\n";
echo "<p>This test script helps identify:</p>\n";
echo "<ul>\n";
echo "<li>✅ API Key validity</li>\n";
echo "<li>✅ Place ID accuracy</li>\n";
echo "<li>✅ Reviews availability</li>\n";
echo "<li>✅ Correct business identification</li>\n";
echo "</ul>\n";

echo "<p><strong>Next Steps:</strong></p>\n";
echo "<ul>\n";
echo "<li>If Place ID is wrong, update it in the configuration</li>\n";
echo "<li>If no reviews found, check if business has Google reviews</li>\n";
echo "<li>If API errors, check API key restrictions in Google Cloud Console</li>\n";
echo "</ul>\n";
?>
