# Adding Custom BOM Items

This guide shows you how to find and add any Bambu Lab part to the BOM updater.

## 🔍 Understanding BOM Structure

Each BOM item needs these fields:

```javascript
{
    "value": "UNI01410",           // Internal Bambu ID
    "label": "100x1mm (1PCS) - KA007",  // Display name
    "sku": "B-KA007",              // Bambu SKU
    "handle": "cob-led-strip-light",    // URL-friendly name
    "title": "100x1mm (1PCS) - KA007",  // Full title
    "image": "https://...",        // Product image URL
    "quantity": 1,                  // Quantity needed
    "filamentCodes": null,
    "linkText": "",
    "linkUrl": "",
    "children": null,
    "parentIds": ["UNI01362", "UNI01363", "UNI01438"]  // Related items
}
```

### Required Fields (Minimum)

```javascript
{
    "sku": "B-KA007",              // ⚠️ REQUIRED
    "title": "100x1mm LED Strip",  // ⚠️ REQUIRED
    "quantity": 1,                  // ⚠️ REQUIRED
    "image": "https://..."          // ⚠️ REQUIRED
}
```

---

## 🛠️ Method 1: Use the Discovery Tool (Easiest)

### Step 1: Load the Discovery Script

1. Go to any MakerWorld model edit page
2. Open browser console (F12)
3. Copy and paste [`utils/discover-bom-items.js`](../utils/discover-bom-items.js)
4. Press Enter

### Step 2: Add a BOM Item Through UI

1. Click "Add BOM Item" or "Add Part"
2. Browse Bambu's catalog
3. Select the part you want
4. Click Add/Save

### Step 3: Copy the JSON

The script will automatically capture and display the exact JSON structure:

```
======================================================================
✅ CAPTURED BOM DATA!
======================================================================

Found 1 BOM item(s):

1. 100x1mm (1PCS) - KA007
   SKU: B-KA007
   Handle: cob-led-strip-light
   Value: UNI01410
   
   Full JSON:
   {
     "value": "UNI01410",
     "label": "100x1mm (1PCS) - KA007",
     "sku": "B-KA007",
     ...
   }
```

### Step 4: Add to Your Script

Copy the JSON and add it to the `STANDARD_BOM` array:

```javascript
const STANDARD_BOM = [
    {
        // Your captured JSON here
    },
    // Add more items...
];
```

---

## 🔍 Method 2: Inspect Existing Model

If you know a model that already has the BOM item you want:

### Step 1: Open the Model

Go to any model that has the BOM item you want to copy.

### Step 2: Run This in Console

```javascript
// Fetch the model's edit page data
fetch(window.location.href)
    .then(r => r.text())
    .then(html => {
        // Extract BOM data from page
        const match = html.match(/"boms":\[({.*?})\]/);
        if (match) {
            const bom = JSON.parse('[' + match[1] + ']');
            console.log('Found BOM item:');
            console.log(JSON.stringify(bom, null, 2));
        } else {
            console.log('No BOM found on this model');
        }
    });
```

### Step 3: Copy the Output

The console will show the complete BOM structure.

---

## 🌐 Method 3: Check Bambu Store API

### Step 1: Find the Product

Go to Bambu Lab's store and find the product you want.

### Step 2: Get Product ID

The URL will look like:
```
https://store.bambulab.com/us/products/...
```

The product ID is in the URL or page source.

### Step 3: Query the API

```javascript
// Replace PRODUCT_ID with actual ID
fetch('https://api.bambulab.com/v1/store/product/PRODUCT_ID')
    .then(r => r.json())
    .then(data => {
        console.log('Product data:');
        console.log(JSON.stringify(data, null, 2));
        
        // Extract BOM-relevant fields
        console.log('');
        console.log('For BOM use:');
        console.log('  sku: ' + data.sku);
        console.log('  title: ' + data.name);
        console.log('  image: ' + data.image);
    });
```

---

## 📋 Common Bambu Parts

Here are some common parts and their SKUs:

| Part | SKU | Handle |
|------|-----|--------|
| COB LED Strip 100x1mm | B-KA007 | cob-led-strip-light |
| USB-A to 2-Pin 8mm | B-XC002 | usb-a-to-2-pin-8mm-solderless-quick-connector-for-white-led |
| Power Adapter | B-??? | (check store) |
| Switch | B-??? | (check store) |

> ⚠️ **Note:** SKU and handle values change. Use the discovery tools above to get current values.

---

## ✏️ Example: Adding a Custom Part

Let's say you want to add a **power switch** to your BOM:

### Step 1: Discover the Part

Use Method 1 (Discovery Tool) to add a switch through the UI and capture its JSON.

### Step 2: Add to Script

```javascript
const STANDARD_BOM = [
    {
        "value": "UNI01410",
        "label": "100x1mm (1PCS) - KA007",
        "sku": "B-KA007",
        "handle": "cob-led-strip-light",
        "title": "100x1mm (1PCS) - KA007",
        "image": "https://store.bblcdn.com/s7/default/5d0393d6ef074f9eb4ffe36a0101d3f7/COB_dba4abce-930a-4af0-80c7-7fd7aef5359f.png",
        "quantity": 1
    },
    {
        // Your new switch
        "value": "UNI02345",
        "label": "Rocker Switch 12mm",
        "sku": "B-SW001",
        "handle": "rocker-switch-12mm",
        "title": "Rocker Switch 12mm (2PCS) - SW001",
        "image": "https://store.bblcdn.com/...",
        "quantity": 2
    }
];
```

### Step 3: Run the Script

Your script will now add both the LED strip AND the switch to all models!

---

## 🐛 Troubleshooting

### "Item doesn't appear in BOM"

- Make sure all required fields are present (sku, title, image, quantity)
- Check that the image URL is accessible
- Verify the SKU exists in Bambu's catalog

### "Wrong item appears"

- Double-check the SKU matches what you want
- Some parts have similar names but different SKUs

### "Script fails with HTTP 400"

- The BOM structure is invalid
- Compare your JSON to a known-working example
- Make sure all strings are properly quoted

---

## 💡 Tips

1. **Test with one model first** - Use `TEST_LIMIT = 1` to verify
2. **Keep a backup** - Save your custom BOM configuration
3. **Share with community** - Submit your BOM configs to the repo!
4. **Check quantity** - Make sure quantity makes sense for your models

---

## 📚 Related

- [`utils/discover-bom-items.js`](../utils/discover-bom-items.js) - BOM discovery tool
- [`utils/find-bom-indicator.js`](../utils/find-bom-indicator.js) - Check which models have BOMs
- [README.md](../README.md) - Main documentation

---

**Happy making! 🎨**
