<?php
/**
 * Working Place ID Finder for Capital City Contractors
 * This version works immediately with your API keys
 */

// Your API keys (for immediate testing)
$api_key = 'AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s';
$secret_key = '1t1Jpxqi2j3TufvwV4QjWV376KU=';

echo "<h1>🔍 Place ID Finder for Capital City Contractors</h1>\n";
echo "<p>Searching for your verified Google Business Profile Place ID...</p>\n";

// Business information
$business_info = [
    'name' => 'Capital City Contractors',
    'phone' => '613-301-1311',
    'location' => 'Ottawa, Ontario, Canada (Service Area)',
    'services' => ['painting', 'drywall', 'renovation', 'contractor'],
    'business_profile_id' => '3886356099819080585',
    'store_code' => '15922219453360051580'
];

echo "<div style='background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px;'>\n";
echo "<h3>Business Information:</h3>\n";
echo "<p><strong>Name:</strong> {$business_info['name']}</p>\n";
echo "<p><strong>Phone:</strong> {$business_info['phone']}</p>\n";
echo "<p><strong>Type:</strong> Service Area Business (No Physical Storefront)</p>\n";
echo "<p><strong>Service Areas:</strong> Ottawa, Kanata, Nepean, Orleans, Richmond, Stittsville</p>\n";
echo "<p><strong>Business Profile ID:</strong> {$business_info['business_profile_id']}</p>\n";
echo "</div>\n";

// Enhanced search strategies for service-area businesses
$search_strategies = [
    [
        'method' => 'textsearch',
        'query' => 'Capital City Contractors Ottawa Ontario',
        'description' => 'Exact business name with location'
    ],
    [
        'method' => 'textsearch', 
        'query' => 'Capital City Contractors 613-301-1311',
        'description' => 'Business name with phone number'
    ],
    [
        'method' => 'textsearch',
        'query' => '613-301-1311 Ottawa contractor',
        'description' => 'Phone number with service type'
    ],
    [
        'method' => 'textsearch',
        'query' => 'Capital City Contractors painting Ottawa',
        'description' => 'Service-based search'
    ],
    [
        'method' => 'textsearch',
        'query' => 'Capital City Contractors service area Ottawa',
        'description' => 'Service area business search'
    ],
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
            'fields' => 'place_id,name,formatted_address,rating,user_ratings_total,geometry,types',
            'key' => $api_key
        ]);
    }
    
    echo "<p><strong>Query:</strong> {$strategy['query']}</p>\n";
    
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
        echo "<p style='color: orange;'>⚠️ No results found for this search</p>\n";
        continue;
    }
    
    echo "<p style='color: green;'>✅ Found " . count($results) . " result(s)</p>\n";
    
    foreach ($results as $i => $result) {
        $place_id = $result['place_id'] ?? 'Unknown';
        $name = $result['name'] ?? 'Unknown';
        $address = $result['formatted_address'] ?? 'Unknown';
        $rating = $result['rating'] ?? 'N/A';
        $review_count = $result['user_ratings_total'] ?? 0;
        $types = $result['types'] ?? [];
        
        echo "<div style='border: 2px solid #4CAF50; margin: 10px 0; padding: 15px; border-radius: 8px; background: #f9fff9;'>\n";
        echo "<h4>🎯 Result " . ($i + 1) . "</h4>\n";
        echo "<p><strong>Name:</strong> $name</p>\n";
        echo "<p><strong>Address:</strong> $address</p>\n";
        echo "<p><strong>Place ID:</strong> <code style='background: yellow; padding: 2px 4px; font-size: 14px;'>$place_id</code></p>\n";
        echo "<p><strong>Rating:</strong> $rating ⭐ ($review_count reviews)</p>\n";
        echo "<p><strong>Business Types:</strong> " . implode(', ', $types) . "</p>\n";
        
        // Enhanced confidence scoring for service-area businesses
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
            $confidence_reasons[] = "Address/Service area includes Ottawa";
        }
        
        if ($review_count > 0) {
            $confidence_score += 10;
            $confidence_reasons[] = "Has $review_count reviews";
        }
        
        // Check for contractor-related business types
        $contractor_types = ['general_contractor', 'painter', 'home_improvement', 'establishment'];
        foreach ($contractor_types as $type) {
            if (in_array($type, $types)) {
                $confidence_score += 15;
                $confidence_reasons[] = "Business type includes '$type'";
                break;
            }
        }
        
        echo "<p><strong>Confidence Score:</strong> $confidence_score%</p>\n";
        echo "<p><strong>Confidence Reasons:</strong> " . implode(', ', $confidence_reasons) . "</p>\n";
        
        if ($confidence_score >= 50) {
            echo "<p style='color: green; font-weight: bold; font-size: 16px;'>🎉 HIGH CONFIDENCE MATCH!</p>\n";
            
            // Test this Place ID for reviews
            echo "<h5>🧪 Testing for Reviews:</h5>\n";
            $test_url = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
                'place_id' => $place_id,
                'fields' => 'reviews,rating,user_ratings_total,name,formatted_address',
                'key' => $api_key
            ]);
            
            $test_response = @file_get_contents($test_url, false, $context);
            if ($test_response) {
                $test_data = json_decode($test_response, true);
                if (isset($test_data['result']['reviews']) && count($test_data['result']['reviews']) > 0) {
                    $reviews = $test_data['result']['reviews'];
                    echo "<p style='color: green; font-weight: bold;'>✅ FOUND " . count($reviews) . " LIVE REVIEWS!</p>\n";
                    
                    // Show sample review
                    $first_review = $reviews[0];
                    echo "<div style='background: #e8f5e8; padding: 10px; margin: 5px 0; border-radius: 5px;'>\n";
                    echo "<p><strong>Sample Review:</strong></p>\n";
                    echo "<p><strong>Author:</strong> " . ($first_review['author_name'] ?? 'Anonymous') . "</p>\n";
                    echo "<p><strong>Rating:</strong> " . ($first_review['rating'] ?? 'N/A') . " stars</p>\n";
                    echo "<p><strong>Review:</strong> " . substr($first_review['text'] ?? 'No text', 0, 200) . "...</p>\n";
                    echo "</div>\n";
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
            'reviews' => $review_count,
            'rating' => $rating
        ];
    }
    
    echo "<hr>\n";
}

// Final Summary
echo "<h2>🎯 FINAL RESULTS</h2>\n";

if (empty($found_places)) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 20px; border-radius: 5px;'>\n";
    echo "<h3>❌ No Place IDs Found</h3>\n";
    echo "<p>This could mean:</p>\n";
    echo "<ul>\n";
    echo "<li>Your Google Business Profile might be listed under a different name</li>\n";
    echo "<li>The business might not be fully indexed by Google Places API yet</li>\n";
    echo "<li>API restrictions might be limiting the search results</li>\n";
    echo "</ul>\n";
    echo "</div>\n";
} else {
    // Sort by confidence score
    usort($found_places, function($a, $b) {
        return $b['confidence'] - $a['confidence'];
    });
    
    $best_match = $found_places[0];
    
    if ($best_match['confidence'] >= 50) {
        echo "<div style='background: #d4edda; border: 3px solid #28a745; padding: 25px; border-radius: 10px; margin: 20px 0;'>\n";
        echo "<h3>🏆 RECOMMENDED PLACE ID FOR CAPITAL CITY CONTRACTORS</h3>\n";
        echo "<p style='font-size: 18px;'><strong>Place ID:</strong> <code style='background: yellow; padding: 8px; font-size: 16px; font-weight: bold;'>{$best_match['place_id']}</code></p>\n";
        echo "<p><strong>Business Name:</strong> {$best_match['name']}</p>\n";
        echo "<p><strong>Address/Service Area:</strong> {$best_match['address']}</p>\n";
        echo "<p><strong>Confidence:</strong> {$best_match['confidence']}%</p>\n";
        echo "<p><strong>Reviews:</strong> {$best_match['reviews']}</p>\n";
        echo "<p><strong>Rating:</strong> {$best_match['rating']} ⭐</p>\n";
        echo "</div>\n";
        
        echo "<div style='background: #cce5ff; padding: 20px; border-radius: 5px;'>\n";
        echo "<h3>📝 NEXT STEPS TO ACTIVATE LIVE REVIEWS:</h3>\n";
        echo "<ol style='font-size: 16px;'>\n";
        echo "<li><strong>Copy this Place ID:</strong> <code>{$best_match['place_id']}</code></li>\n";
        echo "<li><strong>I will update your website configuration</strong> with this Place ID</li>\n";
        echo "<li><strong>Your Google Business reviews will display automatically</strong></li>\n";
        echo "<li><strong>Test the integration</strong> to ensure it's working</li>\n";
        echo "</ol>\n";
        echo "</div>\n";
    } else {
        echo "<div style='background: #fff3cd; color: #856404; padding: 20px; border-radius: 5px;'>\n";
        echo "<h3>⚠️ Low Confidence Results</h3>\n";
        echo "<p>Found potential matches but confidence scores are low. Manual verification needed.</p>\n";
        echo "</div>\n";
    }
    
    // Show all results table
    echo "<h3>📋 All Search Results:</h3>\n";
    echo "<table border='1' style='border-collapse: collapse; width: 100%; font-size: 14px;'>\n";
    echo "<tr style='background: #f8f9fa;'><th>Place ID</th><th>Name</th><th>Confidence</th><th>Reviews</th><th>Rating</th><th>Found By</th></tr>\n";
    foreach ($found_places as $place) {
        $bg_color = $place['confidence'] >= 50 ? '#d4edda' : '#fff';
        echo "<tr style='background: $bg_color;'>\n";
        echo "<td><code style='font-size: 12px;'>" . substr($place['place_id'], 0, 20) . "...</code></td>\n";
        echo "<td>{$place['name']}</td>\n";
        echo "<td><strong>{$place['confidence']}%</strong></td>\n";
        echo "<td>{$place['reviews']}</td>\n";
        echo "<td>{$place['rating']} ⭐</td>\n";
        echo "<td>{$place['strategy']}</td>\n";
        echo "</tr>\n";
    }
    echo "</table>\n";
}

echo "<p style='margin-top: 30px; text-align: center; color: #666;'><strong>Search completed:</strong> " . date('Y-m-d H:i:s') . "</p>\n";
?>
