# Gravity Jelly — Android brand assets

Icon = the supplied master artwork (`../app-icon-master.png`, 1254²): a cluster of four
cookie-outlined jelly blocks (pink hero block with a kawaii face in front; yellow, mint
and blue behind) wrapped by a chunky purple two-arrow gravity loop, on a cream ground.
All launcher PNGs below are down-rendered from that one master (`../gravity-jelly-logo.js`
embeds the same file for the brand board).

## Files
| File | Size | Use |
|---|---|---|
| `ic_launcher_foreground.png` | 432² | Adaptive icon **foreground** layer (master art, cream ground baked in) |
| `ic_launcher_background.png` | 432² | Adaptive icon **background** layer (cream gradient fallback) |
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
Background is **cream `#FFF7EC`** (baked into the master art) — matches the game UI.
The master is a raster, so don't recolor it; re-export new art if a campaign needs a
different ground. For one-color contexts use `ic_launcher_monochrome.png`.
