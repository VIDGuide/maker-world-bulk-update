# Utility Scripts

Debug and discovery scripts for working with MakerWorld model data.

## 🆕 discover-bom-items.js

**Intercepts BOM additions and shows you the exact JSON structure needed.**

Perfect for adding custom parts to your BOM configuration!

**Usage:**
1. Go to any MakerWorld model edit page
2. Open browser console (F12)
3. Paste this script and press Enter
4. Add a BOM item through the UI
5. The script captures and displays the JSON

**Example output:**
```
======================================================================
✅ CAPTURED BOM DATA!
======================================================================

Found 1 BOM item(s):

1. 100x1mm (1PCS) - KA007
   SKU: B-KA007
   Handle: cob-led-strip-light
   
   Full JSON:
   {
     "value": "UNI01410",
     "label": "100x1mm (1PCS) - KA007",
     "sku": "B-KA007",
     ...
   }
```

See [docs/ADDING_CUSTOM_BOM_ITEMS.md](../docs/ADDING_CUSTOM_BOM_ITEMS.md) for complete guide.

---

## 🔍 find-bom-indicator.js

Scans all your models to find which ones already have a BOM (Bill of Materials).

**What it does:**
- Fetches all your published models
- Checks every field for BOM indicators
- Lists models that have `bomsNeeded: true`
- Shows which field triggers the BOM icon

**Usage:**
```javascript
// Paste in browser console on https://makerworld.com/en/my/models
```

**Example output:**
```
======================================================================
RESULTS: Models with BOM indicators
======================================================================

✅ Found 3 models with BOM:

1. Sky Racing Logo - LED Light Up Sign
   ID: 2484645
   Reason: bomsNeeded = true

2. Nissan Badge Logo LED Light Up Sign (Patrol)
   ID: 2371668
   Reason: bomsNeeded = true

3. Dog Town Skates - Skate Art LED Light up Sign
   ID: 2129530
   Reason: bomsNeeded = true
```

---

## 🏷️ check-bom-flags.js

Inspects the BOM-related fields in your model data structure.

**What it does:**
- Fetches first 5 models
- Checks all BOM-related fields:
  - `bomsNeeded` (top-level flag)
  - `isFeaturedBoms` (featured BOM flag)
  - `auxiliaryBom` (BOM items array)
  - `auxiliaryGuide` (guide attachments)
  - `auxiliaryOther` (other attachments)
  - `plates[].objects` (3D objects on print plates)

**Usage:**
```javascript
// Paste in browser console on https://makerworld.com/en/my/models
```

**Example output:**
```
1. Sky Racing Logo - LED Light Up Sign
   bomsNeeded: true
   isFeaturedBoms: false
   auxiliaryBom: []
   auxiliaryGuide: []
   auxiliaryOther: []
   BOM-related keys: bomsNeeded, isFeaturedBoms
     bomsNeeded: true
     isFeaturedBoms: false
```

---

## 🛠️ When to Use These

### Debugging Issues

If the main script isn't working as expected:

1. **Run `find-bom-indicator.js`** to see which models are detected as having BOMs
2. **Run `check-bom-flags.js`** to inspect the actual data structure
3. Compare the output to identify discrepancies

### Understanding the API

These scripts are great for:
- Learning the MakerWorld API data structure
- Understanding how BOM data is stored
- Discovering what fields are available for automation

### Extending the Tool

Want to add features? Use these scripts to:
- Find other model fields you might want to update
- Test API responses before writing code
- Validate your understanding of the data

---

## 📝 Notes

- These scripts are **read-only** - they don't modify any data
- Safe to run multiple times
- No rate limiting needed (only fetches a few models)
- Output is logged to browser console

---

## 🔗 Related

- [Main Script](../bom-batch-update-resumable.js) - Batch BOM updater
- [README](../README.md) - Full documentation
