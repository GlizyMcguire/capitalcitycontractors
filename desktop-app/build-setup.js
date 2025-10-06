// Build setup script - copies CRM files before building
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up desktop app build...\n');

// Ensure assets/js directory exists
const assetsJsDir = path.join(__dirname, 'assets', 'js');
if (!fs.existsSync(assetsJsDir)) {
    fs.mkdirSync(assetsJsDir, { recursive: true });
    console.log('✅ Created assets/js directory');
}

// Copy CRM dashboard JavaScript
const sourcePath = path.join(__dirname, '..', 'assets', 'js', 'crm-dashboard.js');
const destPath = path.join(assetsJsDir, 'crm-dashboard.js');

try {
    fs.copyFileSync(sourcePath, destPath);
    console.log('✅ Copied crm-dashboard.js');
    
    // Verify file was copied
    const stats = fs.statSync(destPath);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('\n✅ Build setup complete! Ready to build.\n');
} catch (error) {
    console.error('❌ Error copying files:', error.message);
    console.error('\nPlease ensure the source file exists at:');
    console.error(sourcePath);
    process.exit(1);
}

