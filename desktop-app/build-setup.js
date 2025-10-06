// Build setup script - copies CRM files before building
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up desktop app build...\n');

// Copy CRM dashboard JavaScript to renderer folder (so it's packaged in asar)
const sourcePath = path.join(__dirname, '..', 'assets', 'js', 'crm-dashboard.js');
const rendererPath = path.join(__dirname, 'renderer', 'crm-dashboard.js');

console.log('📂 Source path:', sourcePath);
console.log('📂 Renderer destination:', rendererPath);
console.log('📂 Source exists:', fs.existsSync(sourcePath));

try {
    if (!fs.existsSync(sourcePath)) {
        console.error('❌ Source file not found!');
        console.error('   Looking for:', sourcePath);
        console.error('\n🔍 Please check that the file exists at:');
        console.error('   C:\\Users\\D\\Documents\\GitHub\\capitalcitycontractors\\assets\\js\\crm-dashboard.js');
        process.exit(1);
    }

    // Copy to renderer folder
    fs.copyFileSync(sourcePath, rendererPath);
    console.log('✅ Copied crm-dashboard.js to renderer folder');

    // Verify file was copied
    const stats = fs.statSync(rendererPath);
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('\n✅ Build setup complete! Ready to build.\n');
} catch (error) {
    console.error('❌ Error copying files:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
}

