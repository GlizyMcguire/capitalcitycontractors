<?php
/**
 * Test the Correct Place ID for Capital City Contractors
 * Place ID: ChIJAZyYC-K4a04RRe9kJq7UZKo
 */

// Load API keys from secure config
$secure_config_file = __DIR__ . '/config/api-keys.php';
if (file_exists($secure_config_file)) {
    $keys = include $secure_config_file;
    $api_key = $keys['api_key'] ?? null;
} else {
    // Fallback for immediate testing
    $api_key = 'AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s';
}

$place_id = 'ChIJAZyYC-K4a04RRe9kJq7UZKo'; // Your verified Place ID

echo "<h1>🧪 Testing Capital City Contractors Place ID</h1>\n";
echo "<p><strong>Place ID:</strong> <code style='background: yellow; padding: 5px;'>$place_id</code></p>\n";
echo "<p><strong>Source:</strong> Google Maps URL verification</p>\n";

// Test the Place ID with Google Places API
$url = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
    'place_id' => $place_id,
    'fields' => 'name,formatted_address,rating,user_ratings_total,reviews,formatted_phone_number,website,business_status',
    'key' => $api_key
]);

echo "<h2>🔍 API Test Results</h2>\n";

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 10,
        'user_agent' => 'Capital City Contractors API Test/1.0'
    ]
]);

$response = @file_get_contents($url, false, $context);

if ($response === false) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>\n";
    echo "<h3>❌ API Request Failed</h3>\n";
    echo "<p>Could not connect to Google Places API</p>\n";
    echo "</div>\n";
    exit;
}

$data = json_decode($response, true);

if (!$data) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>\n";
    echo "<h3>❌ Invalid Response</h3>\n";
    echo "<p>Could not parse API response</p>\n";
    echo "</div>\n";
    exit;
}

if (isset($data['status']) && $data['status'] !== 'OK') {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>\n";
    echo "<h3>❌ API Error: {$data['status']}</h3>\n";
    if (isset($data['error_message'])) {
        echo "<p>Error: {$data['error_message']}</p>\n";
    }
    echo "</div>\n";
    exit;
}

// Success! Display the business information
$business = $data['result'];

echo "<div style='background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0;'>\n";
echo "<h3>✅ SUCCESS! Place ID is Valid</h3>\n";
echo "<p><strong>Business Name:</strong> " . ($business['name'] ?? 'Unknown') . "</p>\n";
echo "<p><strong>Address:</strong> " . ($business['formatted_address'] ?? 'Service Area Business') . "</p>\n";
echo "<p><strong>Phone:</strong> " . ($business['formatted_phone_number'] ?? 'Not available') . "</p>\n";
echo "<p><strong>Website:</strong> " . ($business['website'] ?? 'Not available') . "</p>\n";
echo "<p><strong>Rating:</strong> " . ($business['rating'] ?? 'N/A') . " ⭐</p>\n";
echo "<p><strong>Total Reviews:</strong> " . ($business['user_ratings_total'] ?? 0) . "</p>\n";
echo "<p><strong>Business Status:</strong> " . ($business['business_status'] ?? 'Unknown') . "</p>\n";
echo "</div>\n";

// Display reviews if available
if (isset($business['reviews']) && count($business['reviews']) > 0) {
    echo "<h3>🌟 Live Google Reviews Found!</h3>\n";
    echo "<p style='color: green; font-weight: bold;'>Found " . count($business['reviews']) . " reviews from Google Business Profile</p>\n";
    
    foreach ($business['reviews'] as $i => $review) {
        echo "<div style='border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f9f9f9;'>\n";
        echo "<h4>Review " . ($i + 1) . "</h4>\n";
        echo "<p><strong>Author:</strong> " . ($review['author_name'] ?? 'Anonymous') . "</p>\n";
        echo "<p><strong>Rating:</strong> " . ($review['rating'] ?? 'N/A') . " stars</p>\n";
        echo "<p><strong>Date:</strong> " . date('Y-m-d', $review['time'] ?? time()) . "</p>\n";
        echo "<p><strong>Review:</strong> " . ($review['text'] ?? 'No text provided') . "</p>\n";
        echo "</div>\n";
    }
} else {
    echo "<div style='background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px;'>\n";
    echo "<h3>⚠️ No Reviews in API Response</h3>\n";
    echo "<p>The Place ID is valid, but no reviews were returned by the API.</p>\n";
    echo "<p>This could mean:</p>\n";
    echo "<ul>\n";
    echo "<li>Reviews exist but aren't included in this API response</li>\n";
    echo "<li>API permissions might need adjustment</li>\n";
    echo "<li>Reviews might be filtered by Google</li>\n";
    echo "</ul>\n";
    echo "</div>\n";
}

// Integration status
echo "<h2>🚀 Google Reviews Integration Status</h2>\n";

if (isset($business['name']) && stripos($business['name'], 'Capital City') !== false) {
    echo "<div style='background: #d4edda; color: #155724; padding: 20px; border-radius: 5px;'>\n";
    echo "<h3>🎉 INTEGRATION READY!</h3>\n";
    echo "<p><strong>✅ Correct Business Found:</strong> {$business['name']}</p>\n";
    echo "<p><strong>✅ Place ID Verified:</strong> $place_id</p>\n";
    echo "<p><strong>✅ API Connection Working:</strong> Successfully retrieved business data</p>\n";
    
    if (isset($business['reviews']) && count($business['reviews']) > 0) {
        echo "<p><strong>✅ Live Reviews Available:</strong> " . count($business['reviews']) . " reviews found</p>\n";
        echo "<h4>🎯 Next Steps:</h4>\n";
        echo "<ol>\n";
        echo "<li>✅ Place ID configured in Google Reviews integration</li>\n";
        echo "<li>✅ API connection verified and working</li>\n";
        echo "<li>🔄 Test the live integration on your website</li>\n";
        echo "<li>🔄 Verify reviews display in testimonials section</li>\n";
        echo "</ol>\n";
    } else {
        echo "<p><strong>⚠️ Reviews Status:</strong> Business found but reviews not in API response</p>\n";
        echo "<h4>🎯 Next Steps:</h4>\n";
        echo "<ol>\n";
        echo "<li>✅ Place ID configured correctly</li>\n";
        echo "<li>✅ Business verification successful</li>\n";
        echo "<li>🔄 Check Google Business Profile for review settings</li>\n";
        echo "<li>🔄 Test integration - may work with different API fields</li>\n";
        echo "</ol>\n";
    }
    echo "</div>\n";
} else {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;'>\n";
    echo "<h3>❌ Business Name Mismatch</h3>\n";
    echo "<p>Found business: " . ($business['name'] ?? 'Unknown') . "</p>\n";
    echo "<p>Expected: Capital City Contractors</p>\n";
    echo "</div>\n";
}

echo "<p style='text-align: center; margin-top: 30px; color: #666;'><strong>Test completed:</strong> " . date('Y-m-d H:i:s') . "</p>\n";
?>
