# DarrenPig Homepage V2.1

Standalone page: <https://darrenpig.github.io/v2/>

## V2.1 changes

- Locally vendored GSAP 3.12.5 and ScrollTrigger; no CDN is required.
- Hero timeline, staggered section entrances, project image parallax, media reveals, and contact animations.
- Automatic `prefers-reduced-motion` handling, including changes made while the page is open.
- Lightweight iframe mode: non-fixed header, no cursor glow, and no continuous GSAP animations.
- WebP project images with JPEG `<picture>` fallbacks.
- CSS fallbacks for viewport units, masks, backdrop filters, text stroke, and older sizing support.
- Content remains visible when GSAP or the main JavaScript file is unavailable.

## Embed

```html
<iframe
  src="https://darrenpig.github.io/v2/"
  title="Peiwei Zhu — Embedded Systems & Robotics"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  style="display:block;width:100%;height:100vh;min-height:720px;border:0">
</iframe>
```

If a sandbox is required, include `allow-scripts allow-same-origin allow-popups` so animations, theme storage, and outbound links continue to work. The page detects iframe embedding automatically; no query parameter is needed.

## Files

- `script.js`: base navigation, theme, fallback reveals, counters, and accessibility.
- `gsap-animations.js`: optional GSAP enhancement layer.
- `assets/vendor/`: local GSAP and ScrollTrigger distributions with upstream license headers.
- `styles.css`: responsive layout, embedded mode, and compatibility fallbacks.

No build command is required.
