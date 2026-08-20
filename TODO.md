# Pre-Launch Checklist — Not Mediocre Editz

Everything below is placeholder content or a loose end that must be resolved before
(or shortly after) launching. Items marked **Required** will make the site look
unfinished if left as-is; **Recommended** are quality upgrades; **Optional** are ideas.

---

## Required — Real content to supply

> **Hidden-segment note:** Everything below that currently has no real content is
> **commented out** in `index.html` inside one HTML comment per block, marked with a
> `HIDDEN-START` line and a `HIDDEN-END -->` line (the latter carries the comment
> closer). The site is clean to launch as-is. When you have real content, delete the
> `HIDDEN-START` line and the `HIDDEN-END -->` line and fill in the values — full
> restore instructions sit in each block.

### 1. Hero showreel
- Drop a 5–8s clip at `assets/videos/showreel.mp4` (or change the `<source>` src).
- `index.html:104` — note: the hero card is portrait (3:4), so a 16:9 clip is
  center-cropped. Either deliver a portrait-friendly cut or ask to adjust the layout.
- Until the file exists, the profile photo stays as the poster frame — safe to ship.

### 2. Case study (flagship project) — FILLED with real content
- Featured piece: the short-form reel at `index.html:124` (hook-first editing,
  pacing, storytelling, colour grading — Editing Skool Masterclass assignment
  appreciated by coach Saif). Video ID: `CeoCKHxMIIg`.
- To swap the featured piece later: replace the iframe video ID and update the
  title/brief copy in the same block.
- Optional: add real view/retention numbers to the three "What went into it" cards
  once this format is published — currently they show the edit's qualities (Hook /
  Pacing / Colour), no fabricated metrics.

### 3. Testimonials ("What clients say") — HIDDEN until ready
- Block at `index.html:285` (between the `HIDDEN-START` and `HIDDEN-END -->` lines).
- No real quotes yet, so the section is hidden rather than showing placeholders.
- To earn the first ones: offer 2–3 small creators/local businesses a sample edit in
  exchange for a genuine review. As projects ship, restore the block and replace the
  two cards with real client quotes (name + role + specific result).
- **Do not invent quotes or client names** — a fake testimonial is worse than none.

### 4. About — track record outcomes — HIDDEN until ready
- Block at `index.html:539` (between the `HIDDEN-START` and `HIDDEN-END -->` lines).
- When restoring, replace the three TODO `<li>` items with real outcomes (channels/
  brands worked with, growth numbers, turnaround improvements). Do not fabricate.

### 5. About — editing philosophy — HIDDEN until ready
- Block at `index.html:515` (between the `HIDDEN-START` and `HIDDEN-END -->` lines).
- When restoring, write 1–2 sentences in your own voice, specific to YOUR approach
  ("I cut the first 30 seconds as if the viewer is already bored…").

### 6. FAQ answers
- The software-stack question is HIDDEN (`index.html:622`) until you name your real
  tools (Premiere Pro + After Effects, DaVinci Resolve, etc.).
- Review the other five answers (`index.html:585` onward) — they're reasonable
  defaults, not commitments. Confirm turnaround, revision count, and payment terms
  match what you actually offer.

### 7. Booking link
- `index.html:658` — replace `cal.com/your-handle` with a real Calendly/Cal.com link.

### 8. Pricing
- `index.html:376, 382, 388` — currently "Custom quote" everywhere (accurate, since
  pricing depends on scope). If you adopt fixed numbers later, swap in "Starting at $X".
- Review tier names/inclusions per card if your offerings change.

---

## Recommended — Verify before/after deploy

### 9. Contact form end-to-end
- The form posts to forms.un-static.com. Send a test submission and confirm the
  message actually arrives (these free endpoints can expire).

### 10. Portfolio playback checks
- Verify the in-page modal opens for all 7 video cards (and images for thumbnails).
- Verify hover previews appear on desktop and are absent on touch devices.
- Check the case-study embed plays (it's click-to-play, not autoplay).

### 11. Meta description refresh
- `index.html:10, 18, 24` — the description still reads generic ("storytelling,
  long-form content…"). Consider rewriting to match the new positioning, e.g.
  "retention-first editing for creators and brands".

### 12. og:image check
- `og:image`/`twitter:image` now point to `https://nmeditz.vercel.app/assets/images/pp-760.jpg`
  — confirm the image loads on the deployed domain (paste the URL into a browser).

---

## Optional — When you have the material

### 13. "Worked with" strip
- `index.html:560` — commented-out template. Uncomment and list real channels/brands
  only with permission to disclose. Keep hidden if nothing real exists.

### 14. Custom portfolio thumbnails
- Grid cards currently use YouTube's auto-generated thumbnails (inconsistent crops/
  quality). Custom-cropped, consistently styled thumbnails look far more intentional.

### 15. Analytics
- No analytics are installed. Adding Vercel Analytics (or similar) would let you
  measure which of the new sections actually convert — worth it before judging results.