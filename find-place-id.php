<?php
/**
 * Place ID Finder for Capital City Contractors
 * Uses Google Places API to find the correct Place ID
 */

$api_key = 'AIzaSyBKK9XJlbqT5n8rF2mP3wQ7vH4sL6nE9xY';

echo "<h1>🔍 Place ID Finder for Capital City Contractors</h1>\n";
echo "<p>This tool searches for the correct Google Places API Place ID for Capital City Contractors.</p>\n";

// Business information we know
$business_info = [
    'name' => 'Capital City Contractors',
    'phone' => '613-301-1311',
    'location' => 'Ottawa, Ontario, Canada',
    'services' => ['painting', 'drywall', 'renovation', 'contractor'],
    'business_profile_id' => '3886356099819080585',
    'store_code' => '15922219453360051580'
];

echo "<div style='background: #f0f0f0; padding: 15px; margin: 15px 0; border-radius: 5px;'>\n";
echo "<h3>Known Business Information:</h3>\n";
echo "<p><strong>Name:</strong> {$business_info['name']}</p>\n";
echo "<p><strong>Phone:</strong> {$business_info['phone']}</p>\n";
echo "<p><strong>Location:</strong> {$business_info['location']}</p>\n";
echo "<p><strong>Business Profile ID:</strong> {$business_info['business_profile_id']}</p>\n";
echo "<p><strong>Store Code:</strong> {$business_info['store_code']}</p>\n";
echo "</div>\n";

// Search strategies
$search_strategies = [
    // Strategy 1: Exact business name and location
    [
        'method' => 'textsearch',
        'query' => 'Capital City Contractors Ottawa Ontario',
        'description' => 'Exact business name with location'
    ],
    // Strategy 2: Business name with phone number
    [
        'method' => 'textsearch', 
        'query' => 'Capital City Contractors 613-301-1311',
        'description' => 'Business name with phone number'
    ],
    // Strategy 3: Phone number search
    [
        'method' => 'textsearch',
        'query' => '613-301-1311 Ottawa contractor',
        'description' => 'Phone number with service type'
    ],
    // Strategy 4: Service-based search
    [
        'method' => 'textsearch',
        'query' => 'painting contractor Ottawa Capital City',
        'description' => 'Service-based search'
    ],
    // Strategy 5: Find Place using phone number
    [
        'method' => 'findplacefromtext',
        'query' => 'Capital City Contractors Ottawa',
        'description' => 'Find Place API search'
    ]
];

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 10,
        'user_agent' => 'Capital City Contractors Place ID Finder/1.0'
    ]
]);

$found_places = [];

foreach ($search_strategies as $index => $strategy) {
    echo "<h2>Strategy " . ($index + 1) . ": {$strategy['description']}</h2>\n";
    
    if ($strategy['method'] === 'textsearch') {
        $url = "https://maps.googleapis.com/maps/api/place/textsearch/json?" . http_build_query([
            'query' => $strategy['query'],
            'key' => $api_key
        ]);
    } else if ($strategy['method'] === 'findplacefromtext') {
        $url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?" . http_build_query([
            'input' => $strategy['query'],
            'inputtype' => 'textquery',
            'fields' => 'place_id,name,formatted_address,rating,user_ratings_total,geometry',
            'key' => $api_key
        ]);
    }
    
    echo "<p><strong>Query:</strong> {$strategy['query']}</p>\n";
    echo "<p><strong>URL:</strong> <code>" . htmlspecialchars($url) . "</code></p>\n";
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        echo "<p style='color: red;'>❌ API request failed</p>\n";
        continue;
    }
    
    $data = json_decode($response, true);
    
    if (!$data) {
        echo "<p style='color: red;'>❌ Invalid JSON response</p>\n";
        continue;
    }
    
    if (isset($data['status']) && $data['status'] !== 'OK') {
        echo "<p style='color: red;'>❌ API Error: {$data['status']}</p>\n";
        if (isset($data['error_message'])) {
            echo "<p>Error message: {$data['error_message']}</p>\n";
        }
        continue;
    }
    
    $results = $data['results'] ?? $data['candidates'] ?? [];
    
    if (empty($results)) {
        echo "<p style='color: orange;'>⚠️ No results found</p>\n";
        continue;
    }
    
    echo "<p style='color: green;'>✅ Found " . count($results) . " result(s)</p>\n";
    
    foreach ($results as $i => $result) {
        $place_id = $result['place_id'] ?? 'Unknown';
        $name = $result['name'] ?? 'Unknown';
        $address = $result['formatted_address'] ?? 'Unknown';
        $rating = $result['rating'] ?? 'N/A';
        $review_count = $result['user_ratings_total'] ?? 0;
        
        echo "<div style='border: 2px solid #4CAF50; margin: 10px 0; padding: 15px; border-radius: 8px; background: #f9fff9;'>\n";
        echo "<h4>🎯 Potential Match " . ($i + 1) . "</h4>\n";
        echo "<p><strong>Name:</strong> $name</p>\n";
        echo "<p><strong>Address:</strong> $address</p>\n";
        echo "<p><strong>Place ID:</strong> <code style='background: yellow; padding: 2px 4px;'>$place_id</code></p>\n";
        echo "<p><strong>Rating:</strong> $rating ⭐ ($review_count reviews)</p>\n";
        echo "<p><strong>Types:</strong> " . implode(', ', $result['types'] ?? []) . "</p>\n";
        
        // Check if this looks like our business
        $confidence_score = 0;
        $confidence_reasons = [];
        
        if (stripos($name, 'Capital City') !== false) {
            $confidence_score += 40;
            $confidence_reasons[] = "Name contains 'Capital City'";
        }
        
        if (stripos($name, 'Contractor') !== false) {
            $confidence_score += 30;
            $confidence_reasons[] = "Name contains 'Contractor'";
        }
        
        if (stripos($address, 'Ottawa') !== false) {
            $confidence_score += 20;
            $confidence_reasons[] = "Address contains 'Ottawa'";
        }
        
        if ($review_count > 0) {
            $confidence_score += 10;
            $confidence_reasons[] = "Has reviews ($review_count)";
        }
        
        echo "<p><strong>Confidence Score:</strong> $confidence_score%</p>\n";
        echo "<p><strong>Confidence Reasons:</strong> " . implode(', ', $confidence_reasons) . "</p>\n";
        
        if ($confidence_score >= 50) {
            echo "<p style='color: green; font-weight: bold;'>🎉 HIGH CONFIDENCE MATCH - This is likely the correct Place ID!</p>\n";
            
            // Test this Place ID immediately
            echo "<h5>🧪 Testing Place ID for Reviews:</h5>\n";
            $test_url = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
                'place_id' => $place_id,
                'fields' => 'reviews,rating,user_ratings_total,name',
                'key' => $api_key
            ]);
            
            $test_response = @file_get_contents($test_url, false, $context);
            if ($test_response) {
                $test_data = json_decode($test_response, true);
                if (isset($test_data['result']['reviews'])) {
                    $reviews = $test_data['result']['reviews'];
                    echo "<p style='color: green;'>✅ Found " . count($reviews) . " reviews!</p>\n";
                    
                    // Show first review as sample
                    if (count($reviews) > 0) {
                        $first_review = $reviews[0];
                        echo "<div style='background: #e8f5e8; padding: 10px; margin: 5px 0; border-radius: 5px;'>\n";
                        echo "<p><strong>Sample Review:</strong></p>\n";
                        echo "<p><strong>Author:</strong> " . ($first_review['author_name'] ?? 'Anonymous') . "</p>\n";
                        echo "<p><strong>Rating:</strong> " . ($first_review['rating'] ?? 'N/A') . " stars</p>\n";
                        echo "<p><strong>Text:</strong> " . substr($first_review['text'] ?? 'No text', 0, 150) . "...</p>\n";
                        echo "</div>\n";
                    }
                } else {
                    echo "<p style='color: orange;'>⚠️ No reviews found for this Place ID</p>\n";
                }
            }
        }
        
        echo "</div>\n";
        
        // Store for summary
        $found_places[] = [
            'place_id' => $place_id,
            'name' => $name,
            'address' => $address,
            'confidence' => $confidence_score,
            'strategy' => $strategy['description'],
            'reviews' => $review_count
        ];
    }
    
    echo "<hr>\n";
}

// Summary
echo "<h2>🎯 Summary & Recommendations</h2>\n";

if (empty($found_places)) {
    echo "<p style='color: red;'>❌ No potential Place IDs found. This suggests:</p>\n";
    echo "<ul>\n";
    echo "<li>The business may not have a Google Business Profile yet</li>\n";
    echo "<li>The business may be listed under a different name</li>\n";
    echo "<li>The business may be a service area business without a physical location</li>\n";
    echo "</ul>\n";
    echo "<p><strong>Recommendation:</strong> Create or claim the Google Business Profile first.</p>\n";
} else {
    // Sort by confidence score
    usort($found_places, function($a, $b) {
        return $b['confidence'] - $a['confidence'];
    });
    
    echo "<p style='color: green;'>✅ Found " . count($found_places) . " potential Place ID(s)</p>\n";
    
    $best_match = $found_places[0];
    if ($best_match['confidence'] >= 50) {
        echo "<div style='background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 10px; margin: 20px 0;'>\n";
        echo "<h3>🏆 RECOMMENDED PLACE ID</h3>\n";
        echo "<p><strong>Place ID:</strong> <code style='background: yellow; padding: 5px; font-size: 16px;'>{$best_match['place_id']}</code></p>\n";
        echo "<p><strong>Business Name:</strong> {$best_match['name']}</p>\n";
        echo "<p><strong>Address:</strong> {$best_match['address']}</p>\n";
        echo "<p><strong>Confidence:</strong> {$best_match['confidence']}%</p>\n";
        echo "<p><strong>Reviews:</strong> {$best_match['reviews']}</p>\n";
        echo "</div>\n";
        
        echo "<h3>📝 Next Steps:</h3>\n";
        echo "<ol>\n";
        echo "<li>Copy the recommended Place ID above</li>\n";
        echo "<li>Update the Place ID in <code>api/google-reviews-proxy.php</code></li>\n";
        echo "<li>Update the Place ID in <code>assets/js/google-reviews.js</code></li>\n";
        echo "<li>Test the integration using the diagnostic tools</li>\n";
        echo "</ol>\n";
    } else {
        echo "<p style='color: orange;'>⚠️ No high-confidence matches found. Manual verification needed.</p>\n";
    }
    
    echo "<h3>📋 All Found Place IDs:</h3>\n";
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>\n";
    echo "<tr><th>Place ID</th><th>Name</th><th>Confidence</th><th>Reviews</th><th>Strategy</th></tr>\n";
    foreach ($found_places as $place) {
        echo "<tr>\n";
        echo "<td><code>{$place['place_id']}</code></td>\n";
        echo "<td>{$place['name']}</td>\n";
        echo "<td>{$place['confidence']}%</td>\n";
        echo "<td>{$place['reviews']}</td>\n";
        echo "<td>{$place['strategy']}</td>\n";
        echo "</tr>\n";
    }
    echo "</table>\n";
}
?>
