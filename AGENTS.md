<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Responsive: mobile + tablet first-class

Every UI change must work on mobile and tablet, not just desktop. Verify before calling it done.

- Breakpoints: mobile `≤ 640px`, tablet `641–1024px`, desktop `> 1024px`. Reuse existing breakpoints in `app/globals.css` (currently `800px`) instead of inventing new ones per component.
- Test widths: 360, 390, 768, 820, 1024 (portrait + landscape). No horizontal scroll at any of them.
- Layout: fluid units (`%`, `fr`, `min()`, `clamp()`, `dvh`) over fixed px widths. Use `100dvh`, not `100vh`, for full-height sections (mobile browser bars).
- Touch: tap targets ≥ 44×44px. Never rely on `:hover` alone — gate hover effects with `@media (hover: hover)`; provide tap/focus equivalent.
- Typography: body ≥ 16px on mobile (prevents iOS input zoom); scale headings with `clamp()`.
- Images/media: `next/image` with correct `sizes` so mobile does not download desktop assets.
- Performance: keep heavy effects (WebGL, large animations, parallax) light or disabled on small/low-power screens; respect `prefers-reduced-motion`.
- Safe areas: pad fixed/edge UI with `env(safe-area-inset-*)` for notched devices.
