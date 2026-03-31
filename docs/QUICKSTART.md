# Quick Start - MakerWorld BOM Batch Updater

**Goal:** Add B-KA007 (LED strip) and B-XC002 (USB connector) to all 200 lightbox models

---

## 🎉 FULLY AUTOMATED - No Manual Steps Needed!

The script now automatically gets draft IDs by calling the edit page API, then updates BOMs and publishes.

### Run Test (3 models)

```bash
cd /home/misaunders/.openclaw/workspace/makerworld-bom-update

# Test with first 3 models
python3 automate_all.py --test
```

### Run Full Batch (All 200 models)

```bash
# Process all 200 lightbox models
python3 automate_all.py
```

**Estimated time:** ~10-15 minutes for 200 models (includes rate limiting)

---

## How It Works

The script automates the complete workflow:

```
┌─────────────────────────────────────────────────────────────┐
│  For each of 200 lightbox models:                           │
│                                                             │
│  1. GET /_next/data/.../edit.json?id={designId}            │
│     → Extracts draft ID from response                       │
│                                                             │
│  2. PUT /api/v1/design-service/my/draft/{draftId}          │
│     → Updates BOM with B-KA007 + B-XC002                    │
│                                                             │
│  3. POST /api/v1/design-service/my/draft/{draftId}/submit  │
│     → Publishes the draft                                   │
│                                                             │
│  4. Wait 1 second (rate limiting)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## The BOM We're Adding

| SKU | Part | Qty |
|-----|------|-----|
| B-KA007 | 100x1mm COB LED Strip | 1 |
| B-XC002 | USB-A to 2 Pin 8mm Connector | 1 |

---

## Options

| Option | Description |
|--------|-------------|
| `--test` | Process only first 3 models |
| `--limit 10` | Process first 10 models |
| (none) | Process all 200 models |

### Examples

```bash
# Test run
python3 automate_all.py --test

# Process 10 models
python3 automate_all.py --limit 10

# Full batch
python3 automate_all.py
```

---

## Rate Limiting

The script includes built-in rate limiting:
- **1 second** between each model
- **20 second** pause every 20 models

This prevents MakerWorld from throttling or blocking requests.

---

## Output

```
[1/200] Sky Racing Logo - LED Light Up Sign
  Design ID: 2484645
  Getting draft ID... ✅ 7411191
  Updating BOM... ✅
  Publishing... ✅

[2/200] Nissan Badge Logo LED Light Up Sign
  Design ID: 2371668
  Getting draft ID... ✅ 7411234
  Updating BOM... ✅
  Publishing... ✅
```

Results are saved to `batch_update_results.json`.

---

## Troubleshooting

**"HTTP 401" or "Unauthorized"**
- Your cookies have expired
- Update the COOKIES dict in `automate_all.py` with fresh values from your browser

**"HTTP 429" (Rate Limited)**
- Increase `REQUEST_DELAY` from 1.0 to 2.0 or higher
- Increase `BATCH_DELAY` from 20.0 to 30.0

**"Timeout"**
- Network issue, script will continue with next model
- Check your internet connection

---

## Files Reference

| File | Purpose |
|------|---------|
| `automate_all.py` | **Main script** - fully automated |
| `batch_update_complete.py` | Alternative (needs draft_ids.json) |
| `makerworld_lightbox_models.json` | 200 models to update |
| `batch_update_results.json` | Results after running |

---

## Questions?

Check `README.md` for full documentation.
