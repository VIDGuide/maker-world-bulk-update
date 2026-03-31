# MakerWorld BOM Batch Updater

A browser-based tool to batch-add Bill of Materials (BOM) to your MakerWorld 3D printing models.

<a href="https://www.buymeacoffee.com/misaunders" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## 🎯 What It Does

Automatically adds a BOM (parts list) to all your MakerWorld lightbox/LED sign models. Perfect for:
- Adding required electronics parts (LED strips, connectors, etc.)
- Ensuring users know what components they need
- Saving hours of manual editing

## ✨ Features

- **Fully Automated** - Processes hundreds of models automatically
- **Resumable** - Stop anytime, progress is saved, resume later
- **Safe** - Preserves all existing data (images, settings, instances)
- **Smart** - Skips models that already have a BOM
- **Rate Limited** - Built-in delays to avoid API throttling
- **Browser-Based** - No installation, runs in your browser console

## 📋 Requirements

- A MakerWorld account with published models
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Your models must be published (not drafts)

## 🚀 Quick Start

### Step 1: Copy the Script

```bash
# Download the script
curl -O https://raw.githubusercontent.com/VIDGuide/maker-world-bulk-update/main/bom-batch-update-resumable.js
```

Or just [download it directly](https://raw.githubusercontent.com/VIDGuide/maker-world-bulk-update/main/bom-batch-update-resumable.js) and open in a text editor.

### Step 2: Open MakerWorld

1. Go to https://makerworld.com/en/my/models
2. Make sure you're logged in
3. Press **F12** to open Developer Tools
4. Click the **Console** tab

### Step 3: Run the Script

1. Copy the entire contents of `bom-batch-update-resumable.js`
2. Paste into the browser console
3. Press **Enter**

### Step 4: Watch It Work

The script will:
1. Fetch all your models
2. Filter to lightbox/LED models
3. Skip models that already have BOMs
4. Update each model with the BOM
5. Publish the changes

## ⚙️ Configuration

### Test Mode (Default)

By default, the script only processes **3 models** for testing:

```javascript
const TEST_LIMIT = 3;  // Process first 3 models
```

### Full Batch Mode

To process ALL models, edit line 17:

```javascript
const TEST_LIMIT = null;  // Process all models
```

### Custom BOM

To change the parts being added, edit the `STANDARD_BOM` array (around line 20):

```javascript
const STANDARD_BOM = [
    {
        "value": "UNI01410",
        "label": "100x1mm (1PCS) - KA007",
        "sku": "B-KA007",
        // ... more fields
    },
    // Add more parts here
];
```

## 📊 Progress Tracking

The script automatically saves progress to your browser's localStorage:

- **Safe to stop** - Press Ctrl+C or close the browser anytime
- **Auto-resume** - Just run the script again, it picks up where it left off
- **View progress** - Check browser console for "Previously processed: X models"

### Reset Progress

To start over from scratch:

```javascript
// In browser console:
clearBomProgress()

// Or:
localStorage.removeItem('bomUpdateProgress')
```

## 🔍 How It Works

1. **Fetch Models** - Calls MakerWorld API to get all your published models
2. **Filter** - Identifies lightbox/LED models by title and tags
3. **Skip Existing** - Checks `bomsNeeded` flag to skip models with BOMs
4. **Get Draft** - Opens edit page to get draft ID
5. **Preserve Data** - Fetches existing draft data (images, settings, etc.)
6. **Update BOM** - Sends PUT request with new BOM + all existing data
7. **Publish** - Submits the draft to publish changes
8. **Save Progress** - Stores completed model IDs in localStorage

## 🛡️ Safety Features

- **Preserves Images** - Fetches and preserves all existing images
- **Preserves Settings** - All model settings, tags, descriptions unchanged
- **Preserves Instances** - All print variants and plates preserved
- **Idempotent** - Safe to run multiple times on same model
- **Rate Limited** - 1 second between requests, 20 second pause every 20 models
- **No External Dependencies** - Pure JavaScript, no npm packages

## 📈 Performance

- **Speed** - ~3-4 minutes for 200 models
- **Rate Limiting** - Built-in delays prevent API throttling
- **Batch Processing** - Processes in groups of 20 with pauses

## 🐛 Troubleshooting

### "HTTP 403 Forbidden"
- Your session may have expired
- Refresh the page and try again
- Make sure you're logged into MakerWorld

### "Failed to get draft ID"
- This model may not have a draft created yet
- Manually open the edit page once, then re-run the script

### "Models not updating"
- Check browser console for error messages
- Verify the model is published (not private)
- Some models may be in "verifying" state (normal, takes 5-15 min)

### Script stops mid-way
- This is normal! Progress is saved
- Just paste the script again to resume
- Check console for "Previously processed: X models"

## 📝 Example Output

```
======================================================================
MakerWorld BOM Batch Updater - RESUMABLE
======================================================================
Started: 3/31/2026, 12:00:00 PM

Previously processed: 0 models

ℹ️ [12:00:01 PM] Fetching your published models...
ℹ️ [12:00:02 PM] Fetched 50 models (total: 50/282)
ℹ️ [12:00:03 PM] Fetched 50 models (total: 100/282)
...

Total models fetched: 282
Lightbox models: 200
Already have BOM: 3
Need to update: 197
Remaining to process: 197

======================================================================
Ready to update 197 models with:
  - B-KA007: 100x1mm COB LED Strip (qty: 1)
  - B-XC002: USB-A to 2 Pin 8mm Connector (qty: 1)

Estimated time: 3 minutes

💡 Progress is saved automatically - safe to stop/restart!

⏳ Starting in 3 seconds...

[1/197] Sky Racing Logo - LED Light Up Sign
  Design ID: 2484645
  Getting draft ID...   ✅ 7411703
  Fetching existing data...   ✅
  Updating BOM...   ✅
  Publishing...   ✅
```

## 🛠️ Utility Scripts

Debug and discovery tools in the [`/utils`](utils/) folder:

- **`discover-bom-items.js`** - 🆕 Capture BOM JSON from any part you add
- **`find-bom-indicator.js`** - Find which models already have BOMs
- **`check-bom-flags.js`** - Inspect BOM data structure

See [`utils/README.md`](utils/README.md) for details.

### 📚 Documentation

Additional guides in the [`/docs`](docs/) folder:

- **`ADDING_CUSTOM_BOM_ITEMS.md`** - How to find and add any Bambu part
- **`QUICKSTART.md`** - Quick start guide
- **`ANALYSIS_SUMMARY.md`** - Technical analysis

## 📚 Documentation

Additional docs in the [`/docs`](docs/) folder:

- **`QUICKSTART.md`** - Quick start guide
- **`ANALYSIS_SUMMARY.md`** - Project analysis and technical details

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ **You can:**
- Use this script for personal or commercial purposes
- Modify and distribute it
- Use it in your own projects

✅ **You must:**
- Include the original copyright notice
- Include the license text

❌ **You cannot:**
- Hold the author liable for any issues
- Expect warranties or support

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## ⚠️ Disclaimer

This is an unofficial tool not affiliated with MakerWorld or Bambu Lab. Use at your own risk. Always test with a few models first before running on your entire collection.

The script is designed to be safe and preserve all existing data, but you should:
- Test with a small batch first
- Keep backups of important models
- Monitor the first few updates to ensure they work as expected

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/VIDGuide/maker-world-bulk-update/issues)
- **Discussions:** [GitHub Discussions](https://github.com/VIDGuide/maker-world-bulk-update/discussions)

## 🙏 Acknowledgments

- MakerWorld for the API
- The 3D printing community for inspiration
- All beta testers who helped refine this tool

## ☕ Support This Tool

If this script saved you time or helped your projects, consider buying me a coffee!

<a href="https://www.buymeacoffee.com/misaunders" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

Your support helps me maintain and improve this tool for the community! ❤️

---

**Happy Making! 🎨**
