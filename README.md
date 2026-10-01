# ByteSpace

An online course marketplace: landing page, course catalogue, and email/password auth.
Built as a **single Next.js monolith** (frontend and backend in one codebase) with **MongoDB**.

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3
- **Backend:** Next.js Route Handlers (`src/app/api/*`), Mongoose 9, Zod validation
- **Auth:** bcrypt password hashes + signed JWT in an `httpOnly` cookie (jose)
- **Pages:** Landing (`/`), Courses (`/courses`), Course details with About / Lessons / Reviews tabs
  (`/courses/[slug]`, `/lessons`, `/reviews`), Creators (`/creators`), Creator profile (`/creators/[slug]`),
  Login (`/login`), Signup (`/signup`), 404

## Quick start

```bash
npm install
cp .env.example .env.local      # already present if you unzipped the project
# edit .env.local and paste your MongoDB connection string into MONGODB_URI
npm run dev                     # http://localhost:3000
```

`.env.local`:

| Variable      | Required | Description |
|---------------|----------|-------------|
| `MONGODB_URI` | yes (for auth, newsletter, DB-backed courses) | e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/bytespace?retryWrites=true&w=majority` |
| `AUTH_SECRET` | recommended | Signs session tokens. Generate with `openssl rand -base64 32`. If empty, a secret is derived from `MONGODB_URI`. |

**Without `MONGODB_URI`** the site still renders: courses and testimonials are served from the built-in
catalogue (`src/lib/seed-data.ts`). Login, signup and the newsletter return a clear
"Database is not configured" message until you add the URI.

**With `MONGODB_URI`** the database is seeded automatically on first request (courses and testimonials).
Seed data is versioned: if your database was seeded by an older version of the app, it is upgraded in place
automatically (courses are matched by slug, so nothing is duplicated and users are never touched).
To seed manually: `npm run seed` (or `npm run seed:force` to wipe and re-seed the catalogue).

Check the connection any time at `GET /api/health`.

## API

| Method & path | Purpose |
|---|---|
| `POST /api/auth/register` | Create account `{ name, email, password }` and start a session |
| `POST /api/auth/login` | Log in `{ email, password }` |
| `POST /api/auth/logout` | Clear the session cookie |
| `GET  /api/auth/me` | Current user or `null` |
| `GET  /api/courses` | `?category=&q=&level=&sort=&page=&limit=` |
| `POST /api/enrollments` | Enroll the signed-in user `{ slug }` (idempotent) |
| `POST /api/enrollments/progress` | Mark a module done / not done `{ slug, module, done }` |
| `POST /api/creators/:slug/follow` | Toggle following a creator; returns the new follower count |
| `POST /api/newsletter` | Subscribe `{ email }` (idempotent) |
| `GET  /api/health` | App + database status |

Passwords need 8+ characters with a letter and a number. Login and signup are rate limited (in-memory,
per instance) and login responses never reveal whether an email exists.

## Project structure

```
src/
  app/                 routes: pages + api/ route handlers
  components/
    ui/                Logo, Button, Shape (3D art), AvatarStack, SectionHeading
    layout/            Navbar, Footer, NewsletterForm, mobile menu
    course/            CourseCard, CourseGrid, floating stat cards, pills
    home/              Hero, LogoStrip, Discover, LearningPaths, Growth, CreatorTools, CreatorBanner, Testimonials
    auth/              AuthShell, LoginForm, SignupForm, Field, SocialButtons
  lib/                 db, auth (JWT), validators (Zod), courses (data access + fallback), seed data
  models/              Mongoose models: User, Course, Testimonial, Subscriber
scripts/seed.ts        manual database seeding
public/images/         optimised assets exported from the Figma file
```

## Deploy to Vercel

1. Push the repo to GitHub and import it at <https://vercel.com/new> (framework: Next.js, no build settings needed).
2. Add environment variables: `MONGODB_URI` and `AUTH_SECRET`.
3. In MongoDB Atlas, allow Vercel to connect: **Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0)**.
4. Deploy. Visit `/api/health` on the live URL; it should report `"database":"connected"`.

## Git workflow for the assessment

```bash
git remote add origin https://github.com/<you>/bytespace.git
git push -u origin main
git push -u origin feature/bytespace-landing
# then open a Pull Request: feature/bytespace-landing -> main
```

## Notes

- The Figma newsletter button reads "Search"; it is labelled "Subscribe" here because that is what it does.
- Facebook / Google buttons on the auth pages are visual only (no OAuth is wired up) and say so when clicked.
- The cart icon links to the course catalogue; there is no cart or checkout in the design.
- Course cards open the course page; the "by ..." line on a card opens the creator profile.
- **Enroll Now**, **Follow** and lesson progress are real and need a login (logged-out visitors are sent to
  login and brought back). The progress card reflects the modules you actually tick off, so it shows 0% until
  you do, rather than the 55% sample in the design.
- There is no video hosting: the play button on a course opens its Lessons tab.
- Reviews are sample data shared by every course; there is no review submission.
- The design's course screens contradict each other (e.g. 17 vs 112 lessons, 4.5 vs 4.8 stars). The app uses a
  single source of truth per course, so the details page matches the course card.
