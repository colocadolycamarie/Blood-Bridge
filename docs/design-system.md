BLOOD BRIDGE — UI/UX DESIGN SYSTEM & CREATIVE DIRECTION — Figma Spec

1. PRODUCT OVERVIEW
Blood Bridge is an intelligent blood bank and donation management platform. The interface connects donors, hospitals, and blood banks in real time — turning "I see a critical need" into "I'm acting on it" as fast as possible. Not a generic medical website, SaaS dashboard, or templated healthcare portal — life-saving, human-centered, mission-critical, modern, calm under pressure. Every screen must answer three questions immediately: What is happening? What should I do? How fast can I do it?

2. CREATIVE DIRECTION
Visual references: Stripe (editorial storytelling), Linear (clarity), WHO Digital Health (authority), Apple (restraint), Bloomberg/FT (data-as-narrative), Apple Health, Notion, Airbnb (whitespace), premium government health portals.
Avoid: blue-and-white hospital sites, generic feature-card grids, Bootstrap healthcare portals, Dribbble-showcase visuals, card-heavy SaaS marketing pages, cookie-cutter hero→features→testimonials→CTA structure, glassmorphism, heavy gradients, glow effects, neon, cursor effects, particle systems, floating background blobs, magnetic buttons, overly animated backgrounds, decorative dashboards, duplicate/repetitive marketing sections, unnecessary statistics, visual clutter.
Tone: trustworthy, compassionate, urgent-but-calm, editorial not promotional. Reliability communicated before creativity; creativity comes from layout, typography, and meaningful color use — not effects.
Core rule: every interactive element communicates its state (loading/success/error/empty) within ~100ms. A donor responding to a critical request at 3am needs instant, unambiguous feedback — never an ambiguous spinner.

3. COLOR SYSTEM
Role | Hex | Note
Primary bg | #FFFFFF | —
Secondary bg | #FAFAF8 | —
Surface | #FFFFFF | —
Primary text | #1E1E1E | —
Secondary text | #666666 | —
Border | #ECECEC | —
Primary accent (Medical Red) | #C62828 | urgency, not decoration
Secondary accent (Soft Rose) | #FDECEC | —
Success | #2E7D32 | —
Warning | #E67E22 | —
Error | #C62828 | —
Badge mapping: Critical = Red, Urgent = Orange, Routine = Neutral. Color is never the sole urgency signal — see Section 9.

4. TYPOGRAPHY & VISUAL STYLE
Fonts: Inter (UI/body) + Cormorant Garamond (editorial/display), large readable heading scale down to comfortable body copy.
Prioritize: generous whitespace, soft rounded corners (16–20px), subtle shadows, thin borders (#ECECEC), clean typography, simple iconography, minimal illustration.
Avoid: glassmorphism, heavy gradients, glow effects, cursor effects, neon, overly animated backgrounds, complex decorative shapes, visual noise.

5. LAYOUT & SPACING
Section padding 120–160px desktop, asymmetric layout rhythm retained as a brand signature. Large margins, comfortable spacing, strong hierarchy, simple grids, clear grouping, minimal cards, consistent alignment. Whitespace is an active design element — never fill every gap. Mobile-first: navigation, cards, tables, and forms each optimized independently, not a shrunk desktop layout.

6. COMPONENT SPECS
Buttons — simple, rounded, high-contrast, large touch targets (see 9).
Cards — minimal, thin border, soft shadow, no excessive gradients.
Forms — large labels, clear inline validation, simple single-column layout under time pressure.
Tables — clean, easy scanning, comfortable row height, fully responsive.
Urgency badge — color-coded but never color-only; full-text aria-label ("Critical — immediate attention needed") since color alone isn't accessible to colorblind users; decorative pulsing dot on critical hidden from assistive tech, urgency conveyed via the text label.
Navigation — simple, sticky, minimal, easy to scan; theme (light/dark) is an explicit per-page choice, not inferred; mobile gets a persistent always-visible "Emergency" shortcut straight to critical requests — never buried in a hamburger menu.
Toasts — screen-reader announced as a live status region, not conveyed by animation alone; support early manual dismissal for "Undo" actions (e.g. undoing a mistakenly logged donation).
Live request feed — auto-scrolling, pauses on hover/focus so a row can actually be read; each row is a real clickable/tappable element, tapping a critical row jumps straight into a pre-filtered view (blood type + urgency) rather than the generic list.
Region/demand map — tooltip parity between tap (mobile) and hover (desktop): show on tap, dismiss on tap-elsewhere; labels stay legible at 320px, collapsing to a province-selector dropdown + detail panel on narrow viewports rather than cramming small hit targets onto a phone screen.
Protected-screen loading state — shows the real page skeleton (sidebar shape + content placeholders), not a centered spinner, to reduce perceived layout shift.
Hospital dashboard showcase — small "Interactive Preview" label so visitors understand it's a representative demo, not a live snapshot.
Emergency timeline — screen-reader announcements speak only the current step as it reveals, never re-read the whole sequence on every stagger.

7. KEY USER FLOWS
Flow A — Donor responds to a critical request: tap Respond → confirmation step (hospital, location, distance estimate, units needed) before any write, preventing accidental commitment to a real-world action → on confirm, optimistic UI update to "You're matched — get directions" (tel: link + maps link) shown before the write resolves, toast-based rollback on failure → after the donation, prompt to "Log your donation" pre-filled with hospital/blood type/request context, never re-entered from scratch.
Flow B — Hospital posts an emergency request: inline form, not a separate page, preserves context → hospital name/location pre-filled from profile, only blood type/units/urgency required → a visible line before submit states the request will notify nearby compatible donors immediately, setting expectation for the platform's core value proposition.
Flow C — New user onboarding: a single branching question before any form fields — "I want to... Donate blood / Manage a blood bank or hospital" — replaces a flat role dropdown buried mid-form, reduces cognitive load, tailors the rest of the form (blood type field shown to donors only).

8. LANDING PAGE STRUCTURE
14 sections in order: Hero, "27-Minute Window," Stats, How Matching Works, Region Map, Hospital Dashboard Showcase, Blood Type Compatibility Grid, Features, Impact Stories, Trust & Compliance, FAQ, Contact, CTA Banner, Footer.
Data-consistency rule: Hero's live request panel and the Region Map must read from the same underlying dataset so numbers never visibly disagree on the same page — a credibility failure on a platform whose entire pitch is "trust the data."
General: remove unnecessary marketing sections, avoid repetitive feature blocks, favor a clean storytelling arc over a stacked feature grid.

9. SCREENS / PAGES TO DESIGN
Public/marketing: Homepage, About, Services, Features, Pricing, Contact, FAQ, Blood Type Compatibility, Impact, Privacy, Terms, 404/Not Found.
Auth: Login, Register (with the intent-branch question from 7, Flow C).
Dashboard (authenticated, shared shell with sidebar nav): Dashboard Overview, Dashboard → Profile, Dashboard → Requests (browse/respond, incl. the confirm-step modal from 7, Flow A), Dashboard → Inventory (bank/hospital role only — +/- stock controls, debounced per 15), Dashboard → Donations (donation history + "Log a Donation" form, pre-filled or blank per 15).
Each screen needs, at minimum, a loading, empty, and error state per Section 13 — not just the "happy path" composition.

10. INFORMATION ARCHITECTURE — SITEMAP
Primary nav: Home, Requests (public live feed / blood-types link), About, Services, Contact.
Footer-only: Features, Pricing, FAQ, Impact, Privacy, Terms.
Icon/auth-triggered: Login / Register (logged-out), Dashboard avatar menu (logged-in) → Profile, Requests, Inventory, Donations, Logout.
Role-based visibility: Inventory only appears in the Dashboard sidebar for hospital/admin roles — donors never see it. Requests and Donations are visible to all authenticated roles, but the primary action on Requests differs (donor: "Respond" — hospital: "Post request," see 7 Flow B).

Nodes and cross-linking:
Home
├─ Live Request Feed (ticker) → tapping a critical row deep-links to Dashboard → Requests, pre-filtered by type + urgency (per 6)
├─ Region Map → same underlying data source as the Home ticker (per 8's data-consistency rule)
└─ Blood Type Compatibility → standalone public page, also linked from Home's grid section

Register
└─ Intent branch (Donate / Manage a bank or hospital) → tailors which fields render, sets the account's role for Dashboard visibility

Dashboard → Requests
├─ Respond (donor) → Confirmation step (hospital, distance, units) → Matched state (tel: + maps links) → post-donation prompt → Dashboard → Donations (pre-filled "Log a Donation")
└─ Post request (hospital) → inline form, pre-filled hospital/location → confirmation that nearby donors are notified

Dashboard → Inventory
└─ Stock +/- control → disabled/debounced while update is in flight (per 15) → reflects back into the public Region Map / Home ticker data source

Dashboard → Donations
├─ Reached from the post-response prompt → opens pre-filled
└─ Reached from sidebar directly → opens blank

Not-Found (404) sits outside the sitemap as a system-triggered state, not a nav destination — same treatment as empty/error states in Section 13: specific, plain-language guidance back into the product, not a generic error page.

11. ACCESSIBILITY
WCAG 2.1 AA contrast throughout. Minimum touch target 44×44px on every interactive element — buttons, badge pills, icon buttons, accordion triggers, region-map hotspots included. Visible keyboard focus on all interactive elements. Single h1 per page, semantic HTML5. Keyboard-accessible accordions (FAQ). Respect prefers-reduced-motion globally — pulsing "CRITICAL" badges, glow, and ring animations can be genuinely uncomfortable for vestibular/anxiety-sensitive users, an overrepresented population on a medical platform. Toasts/live status announced to screen readers, not conveyed by animation alone. Urgency always conveyed through text/labels in addition to color. Staged/animated reveals (timelines) announce only the newly revealed step, not the full sequence each time.

12. MOTION & MICRO-INTERACTIONS
Use only: fade, slide, scale, small hover transitions/elevation, subtle page transitions, button press feedback, form validation feedback, success confirmation, input focus, notification appearance.
Avoid: continuous floating, constant pulsing, heavy parallax, infinite decorative animation, cursor-glow, magnetic buttons, particle systems.
Motion never distracts from urgent information. All looping/continuous animation (ticker, background glow) pauses on document.visibilitychange — a user may leave the tab open during an emergency wait. All motion degrades to opacity-only under prefers-reduced-motion, no exceptions.

13. EMPTY / ERROR / LOADING STATES
Empty — specific, actionable guidance, not "No data found." E.g. "No active emergency requests nearby," paired with a next action where possible.
Error — states what happened, why, and how to fix it, in plain language. Auth screens keep generic copy for security (don't reveal whether an email is registered) but surface it inline near the field, not only in a disappearing toast.
Loading — skeleton loaders preferred over centered spinners, especially on authenticated/dashboard screens, so the layout is legible from the first frame.

14. RESPONSIVE DESIGN
Mobile-first; never a scaled-down desktop layout. Navigation, cards, tables, forms each optimized independently for small viewports. Complex components (region map) get a distinct simplified mobile pattern, not a shrunk desktop version. Touch interactions have full parity with hover-based desktop interactions.

15. DASHBOARD UI
Authenticated views load with a skeleton matching the real layout (sidebar + content placeholders). Controls mutating a single-state value (e.g. a stock counter tied to a one-row-per-category rule) visually disable/debounce while an update is in flight, preventing a double action from reading as broken. Screens reached via a guided flow (e.g. "Log a Donation" from the post-response prompt) open pre-filled; the same screen reached independently from navigation opens blank.

16. FIGMA/QA CHECKLIST
[ ] Urgency badges carry full-text aria-labels, not color alone
[ ] Decorative motion (pulsing dots) hidden from assistive tech
[ ] All interactive elements meet 44×44px minimum touch target
[ ] prefers-reduced-motion respected on all critical/urgent UI
[ ] Looping/background animation pauses on tab-blur
[ ] Live request feed pauses on hover/focus, fully tap/click-actionable
[ ] Region map has tap/hover parity + legible mobile fallback pattern
[ ] Protected/dashboard pages show a real skeleton, not a spinner
[ ] Donor response flow has an explicit confirmation step before any real-world commitment
[ ] Hospital request form pre-fills known profile data, sets clear expectations
[ ] Registration flow branches by intent before showing the full form
[ ] Hero live panel and Region Map numbers are visibly consistent
[ ] Empty and error states use plain, specific, actionable language
[ ] Toasts are screen-reader announced, not only visually animated

Scope note: this document is limited to UI/UX, visual design, interaction design, and frontend presentation. Backend, database, API, authentication, and infrastructure implementation are intentionally out of scope.