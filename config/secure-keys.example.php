<?php
/**
 * Secure API Keys Configuration Template
 * 
 * SECURITY INSTRUCTIONS:
 * 1. Copy this file to 'secure-keys.php' 
 * 2. Add your actual API keys below
 * 3. Move this file OUTSIDE the web root directory for maximum security
 * 4. Set file permissions to 600 (read/write for owner only)
 * 5. Add 'secure-keys.php' to .gitignore to prevent committing keys
 * 
 * NEVER commit the actual secure-keys.php file to version control!
 */

// Prevent direct access
if (!defined('SECURE_CONFIG_ACCESS')) {
    die('Direct access not allowed');
}

return [
    // Google Places API Configuration
    'google_places_api_key' => 'YOUR_GOOGLE_PLACES_API_KEY_HERE',
    'google_places_secret_key' => 'YOUR_GOOGLE_PLACES_SECRET_KEY_HERE',
    
    // Additional secure configuration can be added here
    // 'other_api_key' => 'value',
    
    // Configuration metadata
    'config_version' => '1.0',
    'last_updated' => date('Y-m-d H:i:s'),
    'environment' => 'production' // or 'development', 'staging'
];
?>
