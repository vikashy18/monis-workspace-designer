# monis.rent · Workspace Studio

An interactive workspace designer for [monis.rent](https://monis.rent). Pick a desk and a chair, add monitors, a lamp, plants and the rest, watch the room come together, then rent the whole setup in one step.

**Live:** https://monis-workspace-designer-seven-zeta.vercel.app

## What you can do

- Choose from 3 desks and 3 chairs, and add 10 accessories (up to 3 monitors).
- See every change in an illustrated room right away. New items pop in, the Lift Pro desk rises when you switch to Stand mode, and the fan spins.
- Start from a preset (Nomad Starter, Dev Battlestation, Creator Studio) instead of a blank desk.
- Switch between day and night to see the lamp light and screen glow.
- Pick a rental period (1 week to 6 months, with long-stay discounts) and see the total update live, including the free-delivery threshold.
- Check out with a short form (name, WhatsApp/email, Bali area, delivery date) and get a confirmation with a reference number.
- Share the setup. The configuration lives in the URL (`?desk=lift&chair=mesh&items=monitor:3,lamp`) and is saved to localStorage, so a reload or a link to a co-founder opens the same room.

## Approach

I designed it around the person in the brief: a freelancer who just landed in Bali and wants a working office by next week. They should feel the setup coming together, not scroll a catalog. So the room preview is the hero, the picker is one click away from it (clicking the desk or chair in the room opens its tab), and the price and "Rent" button are always visible: in a sticky sidebar on desktop and a bottom bar on mobile.

Some small decisions came from thinking about real use:

- The small desk only fits 2 monitors. If you switch to it with 3, the app keeps 2 and tells you why, instead of drawing something impossible.
- The checkout asks for WhatsApp first, since that is how things get arranged in Bali, and says clearly that no payment is taken until monis confirms availability.
- Prices are in IDR per month, and the summary shows what you need to add to get free delivery.

## Tech choices

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**, deployed on Vercel. The page is static and prerendered.
- **Hand-drawn SVG illustrations as React components** (`src/components/art.tsx`). Each item draws from its own origin, so the same component renders in the room and in the picker thumbnails. This keeps the bundle small (about 115 kB first load), avoids depending on external images, and makes animation simple CSS transforms.
- **No state library.** The setup is a small serializable object (`src/lib/setup.ts`) with pure functions for pricing, validation (`normalize`), and URL encoding, kept separate from the UI.
- **Accessibility:** real buttons with `aria-pressed`, ARIA tabs, a radio group for the rental period, a labelled dialog with Escape and focus handling, live regions for the total and toasts, and `prefers-reduced-motion` support.

## What I'd improve with more time

- Use real product photos from monis.rent and live stock and pricing from their backend.
- Add drag-and-drop to rearrange accessories on the desk.
- Send the checkout to monis (a WhatsApp deep link or an API) instead of the demo confirmation.
- Add more categories from the sketch (coffee station, outdoor gear, relax zone).
- Write component tests for the pricing and setup logic, plus a Playwright run of the full rent flow.

## Run locally

```bash
npm install
npm run dev
```
