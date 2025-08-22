// Cache Version Updater for Capital City Contractors
// This script automatically updates version numbers in HTML files to bust cache

const fs = require('fs');
const path = require('path');

function updateCacheVersion() {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + 
                     String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    const htmlFile = 'index.html';
    
    if (fs.existsSync(htmlFile)) {
        let content = fs.readFileSync(htmlFile, 'utf8');
        
        // Update CSS version numbers
        content = content.replace(/assets\/css\/[^"]*\.css\?v=[^"]*"/g, (match) => {
            const baseUrl = match.split('?v=')[0];
            return baseUrl + '?v=' + timestamp + '"';
        });
        
        // Update JS version numbers
        content = content.replace(/assets\/js\/[^"]*\.js\?v=[^"]*"/g, (match) => {
            const baseUrl = match.split('?v=')[0];
            return baseUrl + '?v=' + timestamp + '"';
        });
        
        // Update data file version numbers
        content = content.replace(/assets\/data\/[^"]*\.js\?v=[^"]*"/g, (match) => {
            const baseUrl = match.split('?v=')[0];
            return baseUrl + '?v=' + timestamp + '"';
        });
        
        fs.writeFileSync(htmlFile, content);
        console.log(`Cache version updated to: ${timestamp}`);
    } else {
        console.error('index.html not found');
    }
}

// Run if called directly
if (require.main === module) {
    updateCacheVersion();
}

module.exports = updateCacheVersion;
