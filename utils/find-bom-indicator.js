/**
 * Find BOM indicator field in model data
 * Checks every field for BOM-related data
 */

async function findBomIndicator() {
    console.log('======================================================================');
    console.log('Searching for BOM indicator in ALL model fields...');
    console.log('======================================================================');
    console.log('');
    
    // Fetch models
    const allModels = [];
    let offset = 0;
    while (true) {
        const url = '/api/v1/design-service/my/design/published?handle=@vidguide&limit=50&offset=' + offset;
        const response = await fetch(url);
        const data = await response.json();
        const hits = data.hits || [];
        allModels.push(...hits);
        if (hits.length < 50) break;
        offset += 50;
    }
    
    console.log('Total models: ' + allModels.length);
    console.log('');
    
    // Check EVERY model for ANY BOM-related field
    console.log('Checking all fields for BOM data...');
    console.log('');
    
    var modelsWithBom = [];
    
    for (var i = 0; i < allModels.length; i++) {
        var model = allModels[i];
        
        // Check top-level fields
        if (model.bomsNeeded === true) {
            modelsWithBom.push({
                title: model.title,
                id: model.id,
                reason: 'bomsNeeded = true'
            });
            continue;
        }
        
        if (model.isFeaturedBoms === true) {
            modelsWithBom.push({
                title: model.title,
                id: model.id,
                reason: 'isFeaturedBoms = true'
            });
            continue;
        }
        
        // Check instances
        var instances = model.instances || [];
        for (var j = 0; j < instances.length; j++) {
            var inst = instances[j];
            var ext = inst.extention || inst.extension;
            
            if (ext) {
                var modelInfo = ext.modelInfo || {};
                var auxBom = modelInfo.auxiliaryBom;
                
                if (auxBom && auxBom.length > 0) {
                    modelsWithBom.push({
                        title: model.title,
                        id: model.id,
                        reason: 'auxiliaryBom has ' + auxBom.length + ' items'
                    });
                    break;
                }
            }
        }
    }
    
    console.log('======================================================================');
    console.log('RESULTS: Models with BOM indicators');
    console.log('======================================================================');
    console.log('');
    
    if (modelsWithBom.length === 0) {
        console.log('❌ NO models found with BOM indicators!');
        console.log('');
        console.log('This means the published API does NOT return BOM data.');
        console.log('We would need to check draft data for each model (slow).');
    } else {
        console.log('✅ Found ' + modelsWithBom.length + ' models with BOM:');
        console.log('');
        for (var k = 0; k < Math.min(20, modelsWithBom.length); k++) {
            var m = modelsWithBom[k];
            console.log((k + 1) + '. ' + m.title);
            console.log('   ID: ' + m.id);
            console.log('   Reason: ' + m.reason);
            console.log('');
        }
        
        if (modelsWithBom.length > 20) {
            console.log('... and ' + (modelsWithBom.length - 20) + ' more');
        }
    }
    
    console.log('');
    console.log('======================================================================');
}

findBomIndicator();
