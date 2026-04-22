<div align="center">

# EpicShow Frontend

A modern booking experience for movies, sports, events, and gaming.

Built with Next.js App Router and designed to work with the [EpicShow Backend](../EpicShow_Backend/README.md).

`Next.js 16` `React 19` `TypeScript` `Tailwind CSS v4` `Zustand` `Socket.IO` `Razorpay`

</div>

## Features

| Feature | What users get |
| --- | --- |
| Unified booking journeys | Browse, review, pay, and confirm tickets across movies, sports, events, and gaming |
| Realtime seat experience | Seat lock, unlock, and booked states update live while users are selecting |
| Smooth auth flow | Login, register, silent token refresh, protected pages, and SSR-friendly session handling |
| Payments and wallet | Razorpay checkout, wallet payment, top-up flow, and reward-aware pricing |
| Ticket experience | Payment status pages, downloadable PDF tickets, shared ticket links, and OG share posters |
| Personalized profile hub | Bookings, wallet, payments, security, preferences, activity, and account pages |
| Favorites and discovery | Favorites, explore flows, offers, search surfaces, and category-first browsing |
| Support center | Rule-based chatbot plus live assistant chat backed by realtime messaging |
| Rich UI and motion | Framer Motion transitions, responsive navigation, toast feedback, and themed sections |
| Dashboard utilities | TMDB explorer and movie import screens for content workflows |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Realtime | Socket.IO client |
| Payments | Razorpay Checkout |
| Animation | Framer Motion |
| Feedback and icons | SweetAlert2, Lucide React |
| Ticket generation | `jsPDF`, `qrcode`, `next/og` |

## Quick Start

### Prerequisites

- Node.js `18+`
- Running EpicShow backend instance

### Run locally

```bash
cd EpicShow_Frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend API |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Yes | Razorpay public key used by Checkout |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical frontend URL for share links and OG routes |
| `TMDB_BEARER_TOKEN` | Optional | Server-side TMDB token for dashboard discovery routes |
| `NEXT_PUBLIC_TMDB_BEARER_TOKEN` | Optional | Fallback token name supported by the codebase |

## Main App Areas

| Route area | Purpose |
| --- | --- |
| `/` | Landing page and primary discovery experience |
| `/movies`, `/sports`, `/events`, `/gaming` | Category listing pages |
| `/<type>/[id]` | Detail page for the selected item |
| `/<type>/[id]/seat-layout` | Seat selection and realtime seat state |
| `/<type>/[id]/(protected)/review` | Review step before payment |
| `/<type>/[id]/(protected)/payment` | Payment step |
| `/ticket/share` | Share-friendly ticket page |
| `/favorites`, `/offers`, `/explore` | Discovery and engagement surfaces |
| `/profile/*` | User account hub |
| `/dashboard/*` | TMDB explorer and movie import tools |

## How It Works

### API and auth flow

- `lib/api.ts` is the main client-side API wrapper.
- Requests include `credentials: "include"` so refresh cookies work.
- On `401`, the app attempts `POST /auth/refresh` and retries once.
- `context/AuthContext.tsx` restores the user session on app boot.
- `lib/serverFetch.ts` forwards cookies and auth for server-side data fetching.

### Realtime and booking state

- `lib/showSocket.ts` connects to the backend show namespace.
- Realtime seat updates are consumed by the seat layout flow.
- Zustand stores keep booking, payment, theme, and assistant UI state consistent across steps.

### Ticket and share flow

- Razorpay checkout is initialized with `NEXT_PUBLIC_RAZORPAY_KEY`.
- After payment verification, booking pages render ticket details.
- PDF ticket generation lives in the protected payment flows.
- Share pages use `next/og` to generate link previews for social sharing.

## Project Structure

```text
EpicShow_Frontend/
  app/
    api/
    movies/
    sports/
    events/
    gaming/
    profile/
    dashboard/
  components/
  context/
  hooks/
  lib/
  store/
  types/
  public/
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Notes

- The frontend expects a working backend URL in `NEXT_PUBLIC_API_URL`.
- `app/components/BackendWarmup.tsx` helps keep the backend responsive on hosts that sleep after inactivity.
