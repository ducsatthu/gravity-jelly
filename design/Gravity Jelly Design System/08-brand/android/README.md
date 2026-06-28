# Gravity Jelly — Android brand assets

Generated from a single SVG source (`../gravity-jelly-logo.js`). Mark = one big cute
hero jelly block (kawaii face) + a small gravity-rotate accent on a soft sky-blue
gradient.

## Files
| File | Size | Use |
|---|---|---|
| `ic_launcher_foreground.png` | 432² | Adaptive icon **foreground** layer (transparent) |
| `ic_launcher_background.png` | 432² | Adaptive icon **background** layer (sky-blue gradient) |
| `ic_launcher_monochrome.png` | 432² | **Themed** icon (Android 13+), white silhouette |
| `ic_launcher-512.png` | 512² | Play Store listing icon (full-bleed square) |
| `ic_launcher-192…48.png` | 192/144/96/72/48 | Pre-composited launcher icons (rounded) for legacy `mipmap-*` |
| `feature-graphic.png` | 1024×500 | Play Store feature graphic |
| `wordmark-horizontal.png` | 1000×260 | Wordmark, single line, on cream |
| `wordmark-stacked.png` | 760×440 | Wordmark, two lines, on purple |

## Adaptive icon (recommended)
Put the two 432² layers in `res/mipmap-anydpi-v26/` via:

```xml
<!-- res/mipmap-anydpi-v26/ic_launcher.xml -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
```

Drop `ic_launcher_foreground.png` / `ic_launcher_background.png` / `ic_launcher_monochrome.png`
into the matching `drawable-*`/`mipmap-*` density buckets (the 432² masters can be
down-rendered per density). The `ic_launcher-NNN.png` files are convenient pre-rendered
fallbacks for `mipmap-mdpi … xxxhdpi`.

## Colors
Background gradient `#C6E4FF → #8FC2F6 → #73AEEF` (soft sky). Alternate colorways
(mint / coral / bubblegum) live in `gravity-jelly-logo.js → COLORWAYS`. Never recolor the
hero block; for one-color contexts use `ic_launcher_monochrome.png` and tint it.
