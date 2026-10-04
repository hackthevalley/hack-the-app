# Hack the App

Volunteer check-in, walk-in registration, and meal-tracking client for Hack the
Valley.

## Development

Use Node 24, copy `.env.example` to `.env`, then run:

```sh
npm install
npm run dev
```

`VITE_HTB_API` must point to the backend `/api` base URL.

### Development authentication bypass

Development builds allow the scanner route to render without authentication so
the camera and layouts can be tested locally. This bypass is guarded by
`import.meta.env.DEV` and is removed from production builds. API requests still
require a valid backend token; the bypass does not grant server access.

Production routes always pass through `RequireAuth`.

## Verification

```sh
npm run check
```
