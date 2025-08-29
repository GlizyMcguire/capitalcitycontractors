<?php
/**
 * Security Audit Script for Google Reviews API Integration
 * Checks for common security vulnerabilities and API key exposure
 */

echo "<h1>🔐 Security Audit Report</h1>\n";
echo "<p>Checking for API key exposure and security vulnerabilities...</p>\n";

$issues = [];
$warnings = [];
$passed = [];

// Check 1: Look for hardcoded API keys in files
echo "<h2>🔍 Checking for Hardcoded API Keys</h2>\n";

$files_to_check = [
    'api/google-reviews-proxy.php',
    'assets/js/google-reviews.js',
    'find-place-id.php',
    'test-google-api.php',
    'config/api-config.js'
];

foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        
        // Check for API key patterns
        if (preg_match('/AIza[0-9A-Za-z_-]{35}/', $content)) {
            $issues[] = "❌ Hardcoded Google API key found in: $file";
        } else {
            $passed[] = "✅ No hardcoded API keys in: $file";
        }
        
        // Check for secret key patterns
        if (preg_match('/[A-Za-z0-9+\/]{20,}={0,2}/', $content) && strpos($content, 'secret') !== false) {
            $issues[] = "❌ Potential hardcoded secret key found in: $file";
        }
    } else {
        $warnings[] = "⚠️ File not found: $file";
    }
}

// Check 2: Environment variables
echo "<h2>🌍 Checking Environment Configuration</h2>\n";

$api_key_env = getenv('GOOGLE_PLACES_API_KEY');
$secret_key_env = getenv('GOOGLE_PLACES_SECRET_KEY');

if ($api_key_env) {
    $passed[] = "✅ GOOGLE_PLACES_API_KEY environment variable is set";
} else {
    $warnings[] = "⚠️ GOOGLE_PLACES_API_KEY environment variable not set";
}

if ($secret_key_env) {
    $passed[] = "✅ GOOGLE_PLACES_SECRET_KEY environment variable is set";
} else {
    $warnings[] = "⚠️ GOOGLE_PLACES_SECRET_KEY environment variable not set";
}

// Check 3: Secure config file
echo "<h2>📁 Checking Secure Configuration Files</h2>\n";

$secure_config_paths = [
    'config/secure-keys.php',
    '../config/secure-keys.php',
    dirname(__DIR__) . '/config/secure-keys.php'
];

$secure_config_found = false;
foreach ($secure_config_paths as $path) {
    if (file_exists($path)) {
        $secure_config_found = true;
        
        // Check file permissions
        $perms = fileperms($path);
        $octal_perms = substr(sprintf('%o', $perms), -4);
        
        if ($octal_perms === '0600') {
            $passed[] = "✅ Secure config file has correct permissions (600): $path";
        } else {
            $issues[] = "❌ Secure config file has insecure permissions ($octal_perms): $path";
        }
        break;
    }
}

if (!$secure_config_found) {
    $warnings[] = "⚠️ No secure configuration file found";
}

// Check 4: .gitignore file
echo "<h2>📝 Checking .gitignore Configuration</h2>\n";

if (file_exists('.gitignore')) {
    $gitignore = file_get_contents('.gitignore');
    
    if (strpos($gitignore, 'secure-keys.php') !== false) {
        $passed[] = "✅ secure-keys.php is in .gitignore";
    } else {
        $issues[] = "❌ secure-keys.php not found in .gitignore";
    }
    
    if (strpos($gitignore, '.env') !== false) {
        $passed[] = "✅ .env files are in .gitignore";
    } else {
        $warnings[] = "⚠️ .env files not found in .gitignore";
    }
} else {
    $issues[] = "❌ .gitignore file not found";
}

// Check 5: Client-side exposure
echo "<h2>🌐 Checking Client-side Exposure</h2>\n";

$js_files = glob('assets/js/*.js');
foreach ($js_files as $js_file) {
    $content = file_get_contents($js_file);
    
    if (strpos($content, 'window.GOOGLE_PLACES_API_KEY') !== false) {
        $issues[] = "❌ Client-side API key exposure in: $js_file";
    } else {
        $passed[] = "✅ No client-side API key exposure in: $js_file";
    }
}

// Check 6: File permissions
echo "<h2>🔒 Checking File Permissions</h2>\n";

$sensitive_files = [
    'api/google-reviews-proxy.php',
    'config/secure-keys.php',
    '.env'
];

foreach ($sensitive_files as $file) {
    if (file_exists($file)) {
        $perms = fileperms($file);
        $octal_perms = substr(sprintf('%o', $perms), -4);
        
        if (in_array($octal_perms, ['0600', '0644', '0640'])) {
            $passed[] = "✅ Good file permissions ($octal_perms) for: $file";
        } else {
            $warnings[] = "⚠️ Check file permissions ($octal_perms) for: $file";
        }
    }
}

// Display Results
echo "<h2>📊 Security Audit Results</h2>\n";

if (!empty($issues)) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 10px 0;'>\n";
    echo "<h3>❌ Critical Security Issues</h3>\n";
    foreach ($issues as $issue) {
        echo "<p>$issue</p>\n";
    }
    echo "</div>\n";
}

if (!empty($warnings)) {
    echo "<div style='background: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 10px 0;'>\n";
    echo "<h3>⚠️ Warnings</h3>\n";
    foreach ($warnings as $warning) {
        echo "<p>$warning</p>\n";
    }
    echo "</div>\n";
}

if (!empty($passed)) {
    echo "<div style='background: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 10px 0;'>\n";
    echo "<h3>✅ Security Checks Passed</h3>\n";
    foreach ($passed as $pass) {
        echo "<p>$pass</p>\n";
    }
    echo "</div>\n";
}

// Security Score
$total_checks = count($issues) + count($warnings) + count($passed);
$security_score = $total_checks > 0 ? round((count($passed) / $total_checks) * 100) : 0;

echo "<div style='background: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;'>\n";
echo "<h3>🏆 Security Score: $security_score%</h3>\n";

if ($security_score >= 90) {
    echo "<p style='color: green; font-weight: bold;'>Excellent security posture!</p>\n";
} elseif ($security_score >= 70) {
    echo "<p style='color: orange; font-weight: bold;'>Good security, minor improvements needed.</p>\n";
} else {
    echo "<p style='color: red; font-weight: bold;'>Security improvements required!</p>\n";
}
echo "</div>\n";

// Recommendations
echo "<h2>🛡️ Security Recommendations</h2>\n";
echo "<ol>\n";
echo "<li>Use environment variables for all API keys</li>\n";
echo "<li>Never commit API keys to version control</li>\n";
echo "<li>Set restrictive file permissions (600) on sensitive files</li>\n";
echo "<li>Use HTTPS for all API communications</li>\n";
echo "<li>Regularly rotate API keys</li>\n";
echo "<li>Monitor API usage and set up billing alerts</li>\n";
echo "<li>Implement rate limiting and request validation</li>\n";
echo "<li>Use server-side proxy for all external API calls</li>\n";
echo "</ol>\n";

echo "<p><strong>Last audit:</strong> " . date('Y-m-d H:i:s') . "</p>\n";
?>
