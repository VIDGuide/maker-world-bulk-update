# MakerWorld BOM Update Project - Analysis Summary

**Generated:** 2026-03-31 10:46 AEST  
**Account:** @vidguide

## Overview

| Metric | Count |
|--------|-------|
| **Total Models** | 282 |
| **Lightbox/LED Models** | 200 (71%) |
| **Models with Existing BOM** | 0 |

## Key Finding

✅ **None of your 200 lightbox models have BOM data populated yet.**

This means we have a clean slate - no need to merge/append to existing BOMs.

## Lightbox Model Identification

Models were identified as "lightbox/LED" if their title OR tags contained any of:
- `light`, `lamp`, `led`, `lightbox`, `light box`, `night light`

## Top Tags in Lightbox Collection

| Tag | Count |
|-----|-------|
| light | 120 |
| light box | 114 |
| lamp | 110 |
| night light | 100 |
| lightbox | 85 |
| led | 52 |
| light up sign | 29 |
| led light | 24 |
| holden | 17 |
| music | 16 |
| logo | 15 |
| commodore | 15 |

## Sample Lightbox Models (First 10)

1. **Sky Racing Logo - LED Light Up Sign** - Tags: sky racing, led, lightbox
2. **Nissan Badge Logo LED Light Up Sign** - Tags: nissan, logo, patrol
3. **Dog Town Skates - Skate Art LED Light** - Tags: led, lamp, lightbox
4. **American McGee's Alice & Cat LED Light** - Tags: led, lamp, night light
5. **Metallica - Master of Puppets - Album Art LED Sign** - Tags: metallica, album art, led
6. **Holden V6 - 3.8L Injection Badge - LED Logo Light** - Tags: holden, led, lightbox
7. **ARC Raiders - Light up LED Sign** - Tags: led, light box, gaming
8. **FNAF: Bonnie with Guitar LED Light** - Tags: fnaf, led, lamp
9. **Final Space - Mooncake - LED Light Up Sign** - Tags: light, mooncake
10. **Pencil, Stat! Vintage Cassette Surgery LED Light** - Tags: meme, vintage, cassette

## Files Created

| File | Description |
|------|-------------|
| `makerworld_all_models.json` | Full metadata for all 282 models |
| `makerworld_lightbox_models.json` | Filtered: 200 lightbox models only |
| `fetch_models.py` | Python script used to fetch data |
| `ANALYSIS_SUMMARY.md` | This summary |

## Next Steps

1. **Define BOM template** - What parts go in a typical lightbox BOM?
   - Screws? (what sizes?)
   - LED strips? (what type/length?)
   - Diffuser material?
   - Backing plate?
   - Stand/hanger?

2. **Identify model-specific variations** - Do different lightbox sizes need different BOMs?

3. **Test update endpoint** - Find the API endpoint for updating model BOMs

4. **Batch update** - Apply BOMs to all 200 lightbox models

## API Endpoints Discovered

- **List published models:** `GET /api/v1/design-service/my/design/published?handle=@vidguide&limit=50&offset=0`
- **Update endpoint:** TBD (need to inspect browser network traffic)
