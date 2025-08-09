
# Dive Centre Ops — Supabase Connected (Phase 1)

## 0) Configure environment
Set these in Vercel (and in a local `.env` if running locally):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 1) Auth
- Sign in at `/login` via **magic link** (email OTP). RLS allows **authenticated** users.

## 2) Data
- Tables were created by `supabase-phase1-corrected.sql`.
- Import your CSVs into `cylinders` and `rental_items`.

## 3) Run
```
npm install
npm run dev
# open http://localhost:3000
```

## 4) Deploy
```
vercel
```
