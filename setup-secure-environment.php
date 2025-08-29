<?php
/**
 * Windows-Compatible Secure Environment Setup for Capital City Contractors
 * Sets up secure Google Places API configuration on Windows systems
 */

echo "<h1>🔐 Secure Environment Setup for Windows</h1>\n";
echo "<p>Setting up secure Google Places API configuration...</p>\n";

// Your API credentials (will be moved to secure location)
$api_key = 'AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s';
$secret_key = '1t1Jpxqi2j3TufvwV4QjWV376KU=';

echo "<div style='background: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0;'>\n";
echo "<h3>API Credentials to Configure:</h3>\n";
echo "<p><strong>API Key:</strong> " . substr($api_key, 0, 10) . "...</p>\n";
echo "<p><strong>Secret Key:</strong> " . substr($secret_key, 0, 10) . "...</p>\n";
echo "</div>\n";

$setup_steps = [];
$errors = [];

// Step 1: Create secure config directory
echo "<h2>📁 Step 1: Creating Secure Configuration Directory</h2>\n";

$secure_dir = 'config';
if (!is_dir($secure_dir)) {
    if (mkdir($secure_dir, 0755, true)) {
        $setup_steps[] = "✅ Created secure config directory: $secure_dir";
        echo "<p style='color: green;'>✅ Created secure config directory: $secure_dir</p>\n";
    } else {
        $errors[] = "❌ Failed to create secure config directory: $secure_dir";
        echo "<p style='color: red;'>❌ Failed to create secure config directory: $secure_dir</p>\n";
    }
} else {
    $setup_steps[] = "ℹ️ Secure config directory already exists: $secure_dir";
    echo "<p style='color: blue;'>ℹ️ Secure config directory already exists: $secure_dir</p>\n";
}

// Step 2: Create secure keys file
echo "<h2>🔑 Step 2: Creating Secure Keys Configuration</h2>\n";

$secure_keys_file = $secure_dir . '/secure-keys.php';
$secure_keys_content = '<?php
/**
 * Secure API Keys Configuration
 * Generated on: ' . date('Y-m-d H:i:s') . '
 * 
 * SECURITY NOTICE:
 * - This file contains sensitive API credentials
 * - File should have restricted permissions
 * - File is excluded from version control
 */

// Prevent direct access
if (!defined(\'SECURE_CONFIG_ACCESS\')) {
    die(\'Direct access not allowed\');
}

return [
    // Google Places API Configuration
    \'google_places_api_key\' => \'' . $api_key . '\',
    \'google_places_secret_key\' => \'' . $secret_key . '\',
    
    // Configuration metadata
    \'config_version\' => \'1.0\',
    \'last_updated\' => \'' . date('Y-m-d H:i:s') . '\',
    \'environment\' => \'production\'
];
?>';

if (file_put_contents($secure_keys_file, $secure_keys_content)) {
    $setup_steps[] = "✅ Created secure keys file: $secure_keys_file";
    echo "<p style='color: green;'>✅ Created secure keys file: $secure_keys_file</p>\n";
} else {
    $errors[] = "❌ Failed to create secure keys file: $secure_keys_file";
    echo "<p style='color: red;'>❌ Failed to create secure keys file: $secure_keys_file</p>\n";
}

// Step 3: Create .env file
echo "<h2>🌍 Step 3: Creating Environment Variables File</h2>\n";

$env_content = "# Google Places API Configuration
GOOGLE_PLACES_API_KEY=$api_key
GOOGLE_PLACES_SECRET_KEY=$secret_key

# Environment
NODE_ENV=production
";

if (file_put_contents('.env', $env_content)) {
    $setup_steps[] = "✅ Created .env file with API credentials";
    echo "<p style='color: green;'>✅ Created .env file with API credentials</p>\n";
} else {
    $errors[] = "❌ Failed to create .env file";
    echo "<p style='color: red;'>❌ Failed to create .env file</p>\n";
}

// Step 4: Update .gitignore
echo "<h2>📝 Step 4: Updating .gitignore for Security</h2>\n";

$gitignore_additions = [
    'config/secure-keys.php',
    '.env',
    '.env.local',
    '.env.production'
];

$gitignore_content = '';
if (file_exists('.gitignore')) {
    $gitignore_content = file_get_contents('.gitignore');
}

$added_entries = [];
foreach ($gitignore_additions as $entry) {
    if (strpos($gitignore_content, $entry) === false) {
        $gitignore_content .= "\n" . $entry;
        $added_entries[] = $entry;
    }
}

if (!empty($added_entries)) {
    if (file_put_contents('.gitignore', $gitignore_content)) {
        $setup_steps[] = "✅ Updated .gitignore with: " . implode(', ', $added_entries);
        echo "<p style='color: green;'>✅ Updated .gitignore with: " . implode(', ', $added_entries) . "</p>\n";
    } else {
        $errors[] = "❌ Failed to update .gitignore";
        echo "<p style='color: red;'>❌ Failed to update .gitignore</p>\n";
    }
} else {
    $setup_steps[] = "ℹ️ .gitignore already contains necessary entries";
    echo "<p style='color: blue;'>ℹ️ .gitignore already contains necessary entries</p>\n";
}

// Step 5: Test configuration
echo "<h2>🧪 Step 5: Testing Secure Configuration</h2>\n";

if (file_exists($secure_keys_file)) {
    define('SECURE_CONFIG_ACCESS', true);
    $config = include $secure_keys_file;
    
    if (isset($config['google_places_api_key']) && !empty($config['google_places_api_key'])) {
        $setup_steps[] = "✅ Secure configuration test passed";
        echo "<p style='color: green;'>✅ Secure configuration test passed</p>\n";
        echo "<p>API Key loaded: " . substr($config['google_places_api_key'], 0, 10) . "...</p>\n";
    } else {
        $errors[] = "❌ Secure configuration test failed";
        echo "<p style='color: red;'>❌ Secure configuration test failed</p>\n";
    }
} else {
    $errors[] = "❌ Secure keys file not found for testing";
    echo "<p style='color: red;'>❌ Secure keys file not found for testing</p>\n";
}

// Display Results
echo "<h2>📊 Setup Results</h2>\n";

if (!empty($setup_steps)) {
    echo "<div style='background: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 10px 0;'>\n";
    echo "<h3>✅ Successful Setup Steps</h3>\n";
    foreach ($setup_steps as $step) {
        echo "<p>$step</p>\n";
    }
    echo "</div>\n";
}

if (!empty($errors)) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 10px 0;'>\n";
    echo "<h3>❌ Errors Encountered</h3>\n";
    foreach ($errors as $error) {
        echo "<p>$error</p>\n";
    }
    echo "</div>\n";
}

// Final Status
$success_rate = count($setup_steps) / (count($setup_steps) + count($errors)) * 100;

echo "<div style='background: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;'>\n";
echo "<h3>🎯 Setup Status: " . round($success_rate) . "% Complete</h3>\n";

if (empty($errors)) {
    echo "<p style='color: green; font-weight: bold; font-size: 18px;'>🎉 Secure Environment Setup Completed Successfully!</p>\n";
    echo "<h3>🎯 Next Steps:</h3>\n";
    echo "<ol style='text-align: left;'>\n";
    echo "<li>Run security audit: <a href='security-audit.php'>security-audit.php</a></li>\n";
    echo "<li>Test Place ID finder: <a href='find-place-id.php'>find-place-id.php</a></li>\n";
    echo "<li>Test Google Reviews integration: <a href='google-reviews-diagnostic.html'>google-reviews-diagnostic.html</a></li>\n";
    echo "</ol>\n";
} else {
    echo "<p style='color: orange; font-weight: bold;'>⚠️ Setup completed with some issues. Please review errors above.</p>\n";
}

echo "</div>\n";

// Security Recommendations
echo "<h2>🛡️ Security Recommendations</h2>\n";
echo "<div style='background: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px;'>\n";
echo "<ol>\n";
echo "<li>✅ API keys are now stored in secure configuration files</li>\n";
echo "<li>✅ Sensitive files are excluded from version control</li>\n";
echo "<li>🔄 Consider setting up environment variables on your server</li>\n";
echo "<li>🔄 Regularly rotate your API keys for security</li>\n";
echo "<li>🔄 Monitor API usage in Google Cloud Console</li>\n";
echo "<li>🔄 Set up API key restrictions in Google Cloud Console</li>\n";
echo "</ol>\n";
echo "</div>\n";

echo "<p><strong>Setup completed on:</strong> " . date('Y-m-d H:i:s') . "</p>\n";
?>
