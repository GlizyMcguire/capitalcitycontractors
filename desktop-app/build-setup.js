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

console.log('📂 Source path:', sourcePath);
console.log('📂 Destination path:', destPath);
console.log('📂 Source exists:', fs.existsSync(sourcePath));

try {
    if (!fs.existsSync(sourcePath)) {
        console.error('❌ Source file not found!');
        console.error('   Looking for:', sourcePath);
        console.error('\n💡 Trying alternative path...');

        // Try alternative path (in case running from different location)
        const altSourcePath = path.resolve(__dirname, '..', 'assets', 'js', 'crm-dashboard.js');
        console.log('   Alternative path:', altSourcePath);

        if (fs.existsSync(altSourcePath)) {
            fs.copyFileSync(altSourcePath, destPath);
            console.log('✅ Copied crm-dashboard.js (from alternative path)');
        } else {
            console.error('❌ File not found at alternative path either!');
            console.error('\n🔍 Please check that the file exists at:');
            console.error('   C:\\Users\\D\\Documents\\GitHub\\capitalcitycontractors\\assets\\js\\crm-dashboard.js');
            process.exit(1);
        }
    } else {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied crm-dashboard.js');
    }

    // Verify file was copied
    const stats = fs.statSync(destPath);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('\n✅ Build setup complete! Ready to build.\n');
} catch (error) {
    console.error('❌ Error copying files:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
}

