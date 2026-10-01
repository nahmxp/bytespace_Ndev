# ByteSpace

An online course marketplace. People browse and search courses, follow creators, sign up, enrol in
courses, and tick off lessons. Creators get profile pages that list everything they publish.

Built as a single Next.js app: React pages on the front, API routes for everything dynamic, MongoDB
for storage.

---

## Tech stack

| Piece | What it is |
| --- | --- |
| Next.js 15 | App Router, server components, route handlers |
| React 19 | UI |
| MongoDB + Mongoose | Database (Atlas or local) |
| Tailwind CSS | Styling |
| Zod | Validates anything coming in from a form or fetch |
| jose | Signs the session JWT |
| bcryptjs | Password hashing |
| lucide-react | Icons |

---

## Getting started

```bash
npm install
```

Set up your environment. Copy `.env.example` to `.env.local` and fill it in:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/bytespace?retryWrites=true&w=majority
AUTH_SECRET=<something long and random>
```

```bash
npm run dev
```

Then open http://localhost:3000.

> **Important:** Next.js loads `.env.local` *before* `.env`. If `.env.local` exists but is blank, it
> wins and your `MONGODB_URI` will appear to be ignored — which makes every auth route return
> "Database is not configured". Either fill in `.env.local` or delete it and use `.env`.

### Seeding data

The app seeds itself the first time it needs the catalogue, so you can skip this. To do it
explicitly:

```bash
npm run seed          # only fills empty collections
npm run seed:force    # wipes courses + creators + testimonials, then re-seeds
```

Users, enrolments and follows are never touched by `--force`.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Seed the catalogue |
| `npm run seed:force` | Wipe and re-seed the catalogue |

---

## What's implemented

### Accounts and sessions

- **Sign up** at `/signup` — name, email, password. Passwords are hashed with bcrypt.
- **Log in** at `/login`, **log out** from the navbar.
- Sessions are JWTs in an httpOnly cookie (`bs_session`), valid 7 days.
- Logging in or signing up sends you back to where you came from (`?next=`), not always the home page.
- Duplicate emails are rejected on both the check and the insert, so two people racing to register the
  same address can't both win.
- Login is rate limited, and an unknown email still runs a bcrypt comparison so response timing
  doesn't reveal which addresses exist.
- `GET /api/auth/me` returns the current session user or `null`.

### Course catalogue

- **Landing page** with a category filter that loads more courses without a page reload.
- **Courses page** at `/courses` with text search, level filter, 5 sort orders (relevance, newest,
  rating, price up/down), category filter and pagination. All of it lives in the URL, so results are
  shareable and the back button works.
- **Course detail** page with hero image, description, key points, module list, reviews, and a
  sidebar.
- **Reviews tab** per course.
- **Lessons tab** per course listing every module.

### Enrolment and progress

- Enrol button on each course. Signing in first if you're not.
- Enrolling twice is safe (upsert, not duplicate insert).
- **Lesson tracker** ticks modules off individually and saves to the database.
- Your enrolments and completed modules come back when you revisit.

### Creators

- **Creators index** at `/creators`.
- **Creator profile** with bio, follower count, product count, and their courses (filterable and
  sortable).
- **Follow / unfollow** toggle. Logged-out clicks redirect to login and return you afterwards.

### Misc

- **Newsletter signup** in the footer, with email validation and an inline status message.
- Responsive navbar with a mobile menu.
- Course **share** button (native share sheet, falls back to copy-to-clipboard).
- Sticky sidebar, sticky table-of-contents style tabs.
- Empty states, loading states, and per-form error messages throughout.

### Security notes

- Passwords hashed (bcrypt, 12 rounds), never returned by any endpoint.
- JWT in an httpOnly, SameSite=Lax cookie, so JavaScript can't read it.
- `?next=` redirects are validated to be same-site paths, blocking open redirects.
- Zod validates every request body server-side; the client-side checks are only for fast feedback.
- Rate limiting on login and signup.

---

## API routes

| Route | Method | What it does |
| --- | --- | --- |
| `/api/auth/register` | POST | Create an account, set the session cookie |
| `/api/auth/login` | POST | Verify credentials, set the session cookie |
| `/api/auth/logout` | POST | Clear the session cookie |
| `/api/auth/me` | GET | Current session user, or `null` |
| `/api/courses` | GET | Filter/search/sort/paginate courses |
| `/api/enrollments` | POST | Enrol the signed-in user in a course |
| `/api/enrollments/progress` | POST | Save completed modules |
| `/api/creators/[slug]/follow` | POST | Follow or unfollow a creator |
| `/api/newsletter` | POST | Subscribe an email |
| `/api/health` | GET | Check the app and DB are wired up |

All responses share one shape, so the client can handle errors uniformly:

```jsonc
// success
{ "ok": true, ... }

// failure
{ "ok": false, "error": "Incorrect email or password.", "fields": { "email": "..." } }
```

`fields` is present only for validation errors, and is what the forms use to show per-input messages.

---

## Project layout

```
src/
  app/                  Pages and API routes
    (page folders)      login, signup, courses, creators, ...
    api/                Route handlers
  components/           UI, grouped by area
    auth/               Login/signup forms, shared submit hook
    course/             Cards, grid, filter pills
    course-page/        Course detail bits
    creator/            Follow button
    home/               Landing page sections
    layout/             Navbar, footer, mobile menu
    ui/                 Button, logo, shapes, headings
  lib/                  Server-side logic
    auth.ts             Session token sign/verify, cookie helpers
    db.ts               Mongo connection with caching
    courses.ts          Catalogue queries, DB with static fallback
    engagement.ts       Enrolment and follow state
    env.ts              Environment reading
    http.ts             Shared response helpers
    rate-limit.ts       In-memory rate limiter
    seed*.ts            Starter catalogue data
    validators.ts       Zod schemas
  models/               Mongoose schemas
public/images/          Course, avatar, shape, and photo assets
```

### A few design decisions worth knowing

**The database is optional.** If `MONGODB_URI` is missing, the catalogue pages fall back to the
bundled static data so the site still renders. Auth and enrolments genuinely need the database and
return `503` without it.

**Mongoose connections are cached on `globalThis`.** Development hot-reload re-evaluates modules;
without the cache you'd leak a new connection on every edit.

**Course data is upserted by slug.** Re-seeding never duplicates, and `SEED_VERSION` in
`src/lib/seed.ts` forces a refresh of existing databases when the data shape changes.

**The session is read on the server.** `getSession()` works in server components and route handlers,
so pages can personalise ("Hi, Jamie") without a client-side round trip.

---

## Known limitations

- No password reset or email verification.
- Social sign-in buttons are placeholders and show a message rather than working.
- Rate limiting is per-process and in-memory, so it resets on deploy and doesn't span instances.
  Swap `src/lib/rate-limit.ts` for Redis if you need that.
- No test suite.
- Payments are not implemented, so prices are display-only.