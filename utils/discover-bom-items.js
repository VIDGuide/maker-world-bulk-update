/**
 * BOM Item Discovery Tool
 * 
 * Helps you find the JSON structure for any Bambu Lab BOM item
 * 
 * USAGE:
 * 1. Go to any MakerWorld model edit page
 * 2. Open DevTools → Network tab
 * 3. Add a BOM item through the UI
 * 4. Paste this script in Console
 * 5. It will show you the exact JSON needed
 */

// Monitor network requests for BOM additions
console.log('======================================================================');
console.log('BOM Item Discovery Tool');
console.log('======================================================================');
console.log('');
console.log('INSTRUCTIONS:');
console.log('1. Keep this console open');
console.log('2. Go to a model edit page on MakerWorld');
console.log('3. Click "Add BOM Item" or similar');
console.log('4. Select a part from Bambu\'s catalog');
console.log('5. This script will capture the BOM data structure');
console.log('');
console.log('⏳ Listening for BOM network requests...');
console.log('');

// Store captured BOM data
var capturedBoms = [];

// Override fetch to intercept BOM requests
var originalFetch = window.fetch;
window.fetch = function(url, options) {
    return originalFetch.apply(this, arguments).then(function(response) {
        // Clone the response so we can read it
        var clone = response.clone();
        
        // Check if this is a BOM-related request
        if (url.includes('/design-service') && url.includes('/draft/')) {
            clone.json().then(function(data) {
                if (data.boms && data.boms.length > 0) {
                    console.log('');
                    console.log('======================================================================');
                    console.log('✅ CAPTURED BOM DATA!');
                    console.log('======================================================================');
                    console.log('');
                    console.log('Found ' + data.boms.length + ' BOM item(s):');
                    console.log('');
                    
                    data.boms.forEach(function(bom, index) {
                        console.log((index + 1) + '. ' + (bom.title || 'Unknown Item'));
                        console.log('   SKU: ' + (bom.sku || 'NOT SET'));
                        console.log('   Handle: ' + (bom.handle || 'NOT SET'));
                        console.log('   Value: ' + (bom.value || 'NOT SET'));
                        console.log('   Label: ' + (bom.label || 'NOT SET'));
                        console.log('   Quantity: ' + (bom.quantity || 1));
                        console.log('');
                        console.log('   Full JSON:');
                        console.log('   ' + JSON.stringify(bom, null, 2).split('\n').join('\n   '));
                        console.log('');
                        
                        capturedBoms.push(bom);
                    });
                    
                    console.log('======================================================================');
                    console.log('');
                    console.log('💡 To use this in your script, copy the JSON above and add it to');
                    console.log('   the STANDARD_BOM array in bom-batch-update-resumable.js');
                    console.log('');
                    console.log('💾 Captured ' + capturedBoms.length + ' BOM items total');
                    console.log('   Access with: capturedBoms');
                    console.log('======================================================================');
                    console.log('');
                }
            }).catch(function() {
                // Not JSON, ignore
            });
        }
        
        return response;
    });
};

// Also check for existing BOM data on page load
setTimeout(function() {
    console.log('');
    console.log('💡 TIP: You can also find BOM items by:');
    console.log('');
    console.log('1. Opening any model that already has a BOM');
    console.log('2. Running this in console:');
    console.log('');
    console.log('   fetch(window.location.href)');
    console.log('     .then(r => r.text())');
    console.log('     .then(html => {');
    console.log('       const match = html.match(/"boms":\\[({.*?})\\]/);');
    console.log('       if (match) console.log(JSON.parse(\'[\' + match[1] + \']\'));');
    console.log('     });');
    console.log('');
}, 1000);

console.log('');
console.log('✅ Listener active! Add BOM items through the UI now...');
console.log('');
