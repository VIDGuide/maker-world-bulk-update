/**
 * Debug Script - Find BOM indicator flags
 * Checks ALL BOM-related fields in model data
 */

async function checkBomFlags() {
    console.log('======================================================================');
    console.log('Checking ALL BOM-related fields...');
    console.log('======================================================================');
    console.log('');
    
    // Fetch models
    const url = '/api/v1/design-service/my/design/published?handle=@vidguide&limit=5&offset=0';
    const response = await fetch(url);
    const data = await response.json();
    const models = data.hits || [];
    
    console.log('Checking ' + models.length + ' models for BOM flags:');
    console.log('');
    
    for (var i = 0; i < models.length; i++) {
        var model = models[i];
        console.log((i + 1) + '. ' + model.title);
        
        // Check top-level BOM fields
        console.log('   bomsNeeded: ' + (model.bomsNeeded || 'NOT SET'));
        console.log('   isFeaturedBoms: ' + (model.isFeaturedBoms || 'NOT SET'));
        
        // Check instances
        var instances = model.instances || [];
        if (instances.length > 0) {
            var inst = instances[0];
            var ext = inst.extention || inst.extension;
            
            if (ext) {
                var modelInfo = ext.modelInfo || {};
                
                // Check ALL BOM arrays
                console.log('   auxiliaryBom: ' + JSON.stringify(modelInfo.auxiliaryBom || 'NOT SET'));
                console.log('   auxiliaryGuide: ' + JSON.stringify(modelInfo.auxiliaryGuide || 'NOT SET'));
                console.log('   auxiliaryOther: ' + JSON.stringify(modelInfo.auxiliaryOther || 'NOT SET'));
                
                // Check plates for BOM
                var plates = modelInfo.plates || [];
                if (plates.length > 0) {
                    console.log('   plates[0] keys: ' + Object.keys(plates[0]).join(', '));
                }
            }
        }
        
        // Check all keys for anything BOM-related
        var allKeys = Object.keys(model).filter(function(k) {
            return k.toLowerCase().includes('bom');
        });
        
        if (allKeys.length > 0) {
            console.log('   BOM-related keys: ' + allKeys.join(', '));
            for (var j = 0; j < allKeys.length; j++) {
                var key = allKeys[j];
                console.log('     ' + key + ': ' + JSON.stringify(model[key]));
            }
        }
        
        console.log('');
    }
    
    console.log('======================================================================');
}

checkBomFlags();
