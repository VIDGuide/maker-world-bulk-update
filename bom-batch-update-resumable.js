/**
 * MakerWorld BOM Batch Updater - RESUMABLE VERSION
 * 
 * Features:
 * - Tracks progress in browser localStorage
 * - Safe to stop/restart anytime
 * - Skips already-processed models
 * - Processes in batches automatically
 * 
 * INSTRUCTIONS:
 * 1. Go to https://makerworld.com/en/my/models
 * 2. Press F12 to open DevTools → Console tab
 * 3. Paste this script and press Enter
 * 
 * To reset progress: localStorage.removeItem('bomUpdateProgress')
 */

// ============== CONFIGURATION ==============

const TEST_LIMIT = null;  // null = process all, or set number for test batch

const STANDARD_BOM = [
    {
        "value": "UNI01410",
        "label": "100x1mm (1PCS) - KA007",
        "sku": "B-KA007",
        "handle": "cob-led-strip-light",
        "title": "100x1mm (1PCS) - KA007",
        "image": "https://store.bblcdn.com/s7/default/5d0393d6ef074f9eb4ffe36a0101d3f7/COB_dba4abce-930a-4af0-80c7-7fd7aef5359f.png",
        "filamentCodes": null,
        "linkText": "",
        "linkUrl": "",
        "children": null,
        "parentIds": ["UNI01362", "UNI01363", "UNI01438"],
        "quantity": 1
    },
    {
        "value": "UNI01374",
        "label": "USB-A to 2 Pin 8mm (2PCS) - XC002",
        "sku": "B-XC002",
        "handle": "usb-a-to-2-pin-8mm-solderless-quick-connector-for-white-led",
        "title": "USB-A to 2 Pin 8mm (2PCS) - XC002",
        "image": "https://store.bblcdn.com/s7/default/d1cfae21079d4c96b78e6108460daa63/Group1123861026.png",
        "filamentCodes": null,
        "linkText": "",
        "linkUrl": "",
        "children": null,
        "parentIds": ["UNI01362", "UNI01363", "UNI01425"],
        "quantity": 1
    }
];

const LIGHTBOX_KEYWORDS = ['light', 'lamp', 'led', 'lightbox', 'light box', 'night light'];
const REQUEST_DELAY = 1000;
const BATCH_DELAY = 20000;
const BATCH_SIZE = 20;

// Storage key for progress tracking
const STORAGE_KEY = 'bomUpdateProgress';

// ============== HELPER FUNCTIONS ==============

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(prefix + ' [' + timestamp + '] ' + message);
}

function sleep(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function loadProgress() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
    return { processedIds: [], startTime: new Date().toISOString() };
}

function saveProgress(processedIds) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            processedIds: processedIds,
            startTime: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        }));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
}

function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Progress cleared');
}

// ============== MAIN FUNCTIONS ==============

async function fetchMyModels() {
    log('Fetching your published models...');
    
    const allModels = [];
    let offset = 0;
    const limit = 50;
    
    while (true) {
        const url = '/api/v1/design-service/my/design/published?handle=@vidguide&limit=' + limit + '&offset=' + offset;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            const data = await response.json();
            const hits = data.hits || [];
            allModels.push(...hits);
            
            log('Fetched ' + hits.length + ' models (total: ' + allModels.length + '/' + (data.total || 'unknown') + ')');
            
            if (hits.length < limit || allModels.length >= (data.total || 9999)) {
                break;
            }
            
            offset += limit;
            await sleep(500);
            
        } catch (error) {
            log('Error fetching models: ' + error.message, 'error');
            break;
        }
    }
    
    return allModels;
}

function filterLightboxModels(models) {
    return models.filter(function(model) {
        const title = (model.title || '').toLowerCase();
        const tags = (model.tags || []).map(function(t) { return t.toLowerCase(); });
        const searchText = title + ' ' + tags.join(' ');
        
        return LIGHTBOX_KEYWORDS.some(function(keyword) {
            return searchText.includes(keyword);
        });
    });
}

function alreadyHasBom(model) {
    // Check the bomsNeeded flag from the API response
    return model.bomsNeeded === true;
}

async function getDraftId(designId) {
    const buildId = 'DawQXpJFtokG1wzlX4ZK5';
    const url = '/_next/data/' + buildId + '/en/my/models/' + designId + '/edit.json?id=' + designId;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        const data = await response.json();
        const detail = data.pageProps?.detail;
        
        if (detail && detail.id) {
            return detail.id;
        }
        
        throw new Error('No draft ID found');
        
    } catch (error) {
        log('Failed to get draft ID for ' + designId + ': ' + error.message, 'error');
        return null;
    }
}

async function getDraftData(draftId) {
    const url = '/api/v1/design-service/my/draft/' + draftId;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        return await response.json();
        
    } catch (error) {
        log('Failed to fetch draft data: ' + error.message, 'error');
        return null;
    }
}

async function updateBom(draftId, existingData) {
    const url = '/api/v1/design-service/my/draft/' + draftId;
    
    const payload = Object.assign({}, existingData, {
        "bomsNeeded": true,
        "boms": STANDARD_BOM,
    });
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error('HTTP ' + response.status + ': ' + text.substring(0, 100));
        }
        
        return true;
        
    } catch (error) {
        log('Failed to update BOM: ' + error.message, 'error');
        return false;
    }
}

async function publishDraft(draftId) {
    const url = '/api/v1/design-service/my/draft/' + draftId + '/submit';
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        return true;
        
    } catch (error) {
        log('Failed to publish: ' + error.message, 'error');
        return false;
    }
}

async function processModel(model, index, total) {
    const designId = model.id;
    const title = (model.title || 'Unknown').substring(0, 50);
    
    console.log('\n[' + index + '/' + total + '] ' + title);
    console.log('  Design ID: ' + designId);
    
    console.log('  Getting draft ID... ', '');
    const draftId = await getDraftId(designId);
    
    if (!draftId) {
        console.log('  ❌ FAILED');
        return { success: false, stage: 'get_draft' };
    }
    
    console.log('  ✅ ' + draftId);
    
    console.log('  Fetching existing data... ', '');
    const existingData = await getDraftData(draftId);
    
    if (!existingData) {
        console.log('  ❌ FAILED');
        return { success: false, stage: 'fetch_data' };
    }
    
    console.log('  ✅');
    
    console.log('  Updating BOM... ', '');
    const bomUpdated = await updateBom(draftId, existingData);
    
    if (!bomUpdated) {
        console.log('  ❌ FAILED');
        return { success: false, stage: 'update_bom' };
    }
    
    console.log('  ✅');
    
    console.log('  Publishing... ', '');
    const published = await publishDraft(draftId);
    
    if (!published) {
        console.log('  ❌ FAILED');
        return { success: false, stage: 'publish' };
    }
    
    console.log('  ✅');
    
    return { success: true };
}

async function runBatchUpdate() {
    console.clear();
    console.log('======================================================================');
    console.log('MakerWorld BOM Batch Updater - RESUMABLE');
    console.log('======================================================================');
    console.log('Started: ' + new Date().toLocaleString());
    console.log('');
    
    // Load progress
    const progress = loadProgress();
    console.log('Previously processed: ' + progress.processedIds.length + ' models');
    console.log('');
    
    // Fetch all models
    const allModels = await fetchMyModels();
    console.log('\nTotal models fetched: ' + allModels.length);
    
    // Filter to lightbox models
    let lightboxModels = filterLightboxModels(allModels);
    console.log('Lightbox models: ' + lightboxModels.length);
    
    // Filter out models that already have BOM
    let modelsWithoutBom = lightboxModels.filter(function(model) {
        return !alreadyHasBom(model);
    });
    
    console.log('Already have BOM: ' + (lightboxModels.length - modelsWithoutBom.length));
    console.log('Need to update: ' + modelsWithoutBom.length);
    console.log('');
    
    // Filter out already processed
    let modelsToUpdate = modelsWithoutBom.filter(function(model) {
        return !progress.processedIds.includes(model.id);
    });
    
    console.log('Remaining to process: ' + modelsToUpdate.length);
    console.log('');
    
    if (modelsToUpdate.length === 0) {
        log('🎉 All models already processed!', 'success');
        console.log('');
        console.log('To start over, run: localStorage.removeItem("bomUpdateProgress")');
        return;
    }
    
    // Apply test limit
    if (TEST_LIMIT && TEST_LIMIT > 0) {
        modelsToUpdate = modelsToUpdate.slice(0, TEST_LIMIT);
        console.log('⚠️  TEST MODE: Only processing ' + modelsToUpdate.length + ' models');
        console.log('');
    }
    
    // Confirm
    console.log('======================================================================');
    console.log('Ready to update ' + modelsToUpdate.length + ' models with:');
    console.log('  - B-KA007: 100x1mm COB LED Strip (qty: 1)');
    console.log('  - B-XC002: USB-A to 2 Pin 8mm Connector (qty: 1)');
    console.log('');
    const estMinutes = Math.round(modelsToUpdate.length * REQUEST_DELAY / 60000);
    console.log('Estimated time: ' + estMinutes + ' minute' + (estMinutes !== 1 ? 's' : ''));
    console.log('');
    console.log('💡 Progress is saved automatically - safe to stop/restart!');
    console.log('');
    console.log('⏳ Starting in 3 seconds...');
    await sleep(3000);
    
    // Process models
    const stats = {
        total: modelsToUpdate.length,
        success: 0,
        failed: 0,
        failures: {}
    };
    
    const processedIds = progress.processedIds.slice(); // Copy existing
    
    for (let i = 0; i < modelsToUpdate.length; i++) {
        const model = modelsToUpdate[i];
        const result = await processModel(model, i + 1, modelsToUpdate.length);
        
        if (result.success) {
            stats.success++;
            processedIds.push(model.id);
            saveProgress(processedIds); // Save after each success
        } else {
            stats.failed++;
            stats.failures[result.stage] = (stats.failures[result.stage] || 0) + 1;
        }
        
        // Rate limiting
        if (i < modelsToUpdate.length - 1) {
            await sleep(REQUEST_DELAY);
        }
        
        // Batch delay
        if ((i + 1) % BATCH_SIZE === 0 && i < modelsToUpdate.length - 1) {
            console.log('\n⏸️  Batch complete, waiting ' + (BATCH_DELAY/1000) + 's...');
            await sleep(BATCH_DELAY);
        }
    }
    
    // Summary
    console.log('\n======================================================================');
    console.log('SUMMARY');
    console.log('======================================================================');
    console.log('Processed this run: ' + stats.total);
    console.log('Successful:         ' + stats.success);
    console.log('Failed:             ' + stats.failed);
    console.log('Total completed:    ' + processedIds.length + ' / ' + lightboxModels.length);
    console.log('');
    console.log('Finished: ' + new Date().toLocaleString());
    
    if (processedIds.length === lightboxModels.length) {
        console.log('');
        log('🎉 ALL MODELS COMPLETE!', 'success');
        console.log('');
        console.log('To reset for future runs: localStorage.removeItem("bomUpdateProgress")');
    } else {
        console.log('');
        console.log('💡 To continue later, just run this script again!');
        console.log('   Progress is saved in localStorage.');
    }
    
    console.log('======================================================================');
}

// Expose clear function to console
window.clearBomProgress = clearProgress;

// Run
runBatchUpdate().catch(function(error) {
    console.error('Fatal error:', error);
});
