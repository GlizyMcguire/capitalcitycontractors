#!/bin/bash

# Secure Environment Setup Script for Capital City Contractors
# This script helps set up secure API key configuration

echo "🔐 Setting up secure Google Places API configuration..."

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  WARNING: Running as root is not recommended for security."
    echo "Consider running as a non-privileged user."
fi

# Create secure config directory outside web root
SECURE_DIR="../config"
if [ ! -d "$SECURE_DIR" ]; then
    mkdir -p "$SECURE_DIR"
    echo "✅ Created secure config directory: $SECURE_DIR"
fi

# Create secure keys file from template
SECURE_KEYS_FILE="$SECURE_DIR/secure-keys.php"
TEMPLATE_FILE="config/secure-keys.example.php"

if [ ! -f "$SECURE_KEYS_FILE" ]; then
    if [ -f "$TEMPLATE_FILE" ]; then
        cp "$TEMPLATE_FILE" "$SECURE_KEYS_FILE"
        echo "✅ Created secure keys file from template"
    else
        echo "❌ Template file not found: $TEMPLATE_FILE"
        exit 1
    fi
else
    echo "ℹ️  Secure keys file already exists: $SECURE_KEYS_FILE"
fi

# Set secure file permissions
chmod 600 "$SECURE_KEYS_FILE"
echo "✅ Set secure file permissions (600) on keys file"

# Prompt for API keys
echo ""
echo "🔑 Please enter your Google Places API credentials:"
echo ""

read -p "Google Places API Key: " API_KEY
read -p "Google Places Secret Key: " SECRET_KEY

if [ -z "$API_KEY" ] || [ -z "$SECRET_KEY" ]; then
    echo "❌ Both API key and secret key are required"
    exit 1
fi

# Update the secure keys file
cat > "$SECURE_KEYS_FILE" << EOF
<?php
/**
 * Secure API Keys Configuration
 * Generated on: $(date)
 * 
 * SECURITY NOTICE:
 * - This file contains sensitive API credentials
 * - File permissions set to 600 (owner read/write only)
 * - File is outside web root directory
 * - File is excluded from version control
 */

// Prevent direct access
if (!defined('SECURE_CONFIG_ACCESS')) {
    die('Direct access not allowed');
}

return [
    // Google Places API Configuration
    'google_places_api_key' => '$API_KEY',
    'google_places_secret_key' => '$SECRET_KEY',
    
    // Configuration metadata
    'config_version' => '1.0',
    'last_updated' => '$(date)',
    'environment' => 'production'
];
?>
EOF

echo "✅ Updated secure keys file with your credentials"

# Set up environment variables (optional)
echo ""
echo "🌍 Setting up environment variables..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    cat > ".env" << EOF
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=$API_KEY
GOOGLE_PLACES_SECRET_KEY=$SECRET_KEY

# Environment
NODE_ENV=production
EOF
    echo "✅ Created .env file with API credentials"
    chmod 600 ".env"
    echo "✅ Set secure permissions on .env file"
else
    echo "ℹ️  .env file already exists - please update manually if needed"
fi

# Update .gitignore to ensure security
if ! grep -q "secure-keys.php" .gitignore 2>/dev/null; then
    echo "config/secure-keys.php" >> .gitignore
    echo "✅ Added secure-keys.php to .gitignore"
fi

if ! grep -q ".env" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo "✅ Added .env to .gitignore"
fi

# Security recommendations
echo ""
echo "🛡️  SECURITY RECOMMENDATIONS:"
echo ""
echo "1. ✅ API keys are now stored securely outside web root"
echo "2. ✅ File permissions set to 600 (owner only)"
echo "3. ✅ Files excluded from version control"
echo "4. 🔄 Consider rotating API keys periodically"
echo "5. 🔄 Monitor API usage in Google Cloud Console"
echo "6. 🔄 Set up API key restrictions in Google Cloud Console"
echo ""

# Test configuration
echo "🧪 Testing secure configuration..."

if php -r "
define('SECURE_CONFIG_ACCESS', true);
\$config = include '$SECURE_KEYS_FILE';
if (isset(\$config['google_places_api_key']) && !empty(\$config['google_places_api_key'])) {
    echo 'API Key: ' . substr(\$config['google_places_api_key'], 0, 10) . '...' . PHP_EOL;
    echo '✅ Secure configuration test passed' . PHP_EOL;
} else {
    echo '❌ Secure configuration test failed' . PHP_EOL;
    exit(1);
}
"; then
    echo "✅ Secure environment setup completed successfully!"
else
    echo "❌ Configuration test failed - please check your setup"
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "1. Test the Google Reviews integration"
echo "2. Run the Place ID finder: https://yoursite.com/find-place-id.php"
echo "3. Monitor API usage and set up billing alerts"
echo ""
echo "🔐 Your API keys are now secure!"
