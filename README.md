# Anant Yadav — Official Author Website & Publishing CMS

A production-ready digital platform and Content Management System built for Indian author, poet, and philosopher **Anant Yadav**.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![SQLite/PostgreSQL](https://img.shields.io/badge/Database-SQLite%20%7C%20PostgreSQL-336791?style=flat-square&logo=sqlite)

---

## 📖 Overview & Design Aesthetics

The website is engineered as a bespoke, editorial digital sanctuary reflecting the intellectual and poetic voice of Anant Yadav:
- **Literary Typography**: Dynamic pairings of *Newsreader*, *Plus Jakarta Sans*, and *Cinzel*.
- **Contemplative Aesthetics**: Dark/Light mode with warm ink tones, muted bronze/gold highlights, and generous whitespace.
- **Reading Controls**: Interactive font sizing, stanzas formatting, and canvas tones (Dark, Sepia, Light) on poems and essays.
- **No-Code CMS (`/admin`)**: Full dashboard allowing the author to manage published books, poetry archives, essays, philosophical thoughts, media coverage, reading events, and review moderation without touching code.
- **SEO & Search Console Ready**: Full Schema.org JSON-LD structured data (`Person`, `Book`, `Article`, `BlogPosting`, `Event`, `BreadcrumbList`, `WebSite`), dynamic XML sitemap (`/sitemap.xml`), compliant `robots.txt`, and OpenGraph dynamic card generation (`/api/og`).

---

## 🏛 Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) & React 19 | Server Components, Edge routes, Dynamic OpenGraph |
| **Language** | TypeScript | Strict type safety across client & server |
| **Styling** | Tailwind CSS v4 | Literary tokens, glassmorphism, responsive containers |
| **Database & ORM** | Prisma ORM with SQLite / PostgreSQL | Zero-friction local file database + plug-and-play cloud PostgreSQL (Supabase/Neon) |
| **Authentication** | Jose JWT & Secure HttpOnly Cookies | Password hashing with bcrypt, session verification middleware |
| **Icons** | Lucide React & Vector SVGs | Feather, BookOpen, Quote, Shield, Brand SVGs |

---

## 🌐 Public Sections

1. **Home (`/`)**: Hero with author statement, featured books showcase, latest poetry preview, long-form essays, daily thought quote card, and newsletter dispatch signup.
2. **About (`/about`)**: Author profile, full biography, philosophy of craft, education, achievements, and press kit details.
3. **Books (`/books` & `/books/[slug]`)**: Complete bibliography, book landing pages with covers, publisher, ISBN, author notes, reader reviews, purchase/reading links, and `Book` JSON-LD schema.
4. **Poetry (`/poetry` & `/poetry/[slug]`)**: Poetry archive with category filters, reading mode controls (font resize, sepia/dark tones), stanza preservation, audio voice player, and previous/next navigation.
5. **Writings (`/writings` & `/writings/[slug]`)**: Long-form essays, reflections, and literary notes with live reading progress bar, table of contents, and `Article` schema.
6. **Thoughts (`/thoughts`)**: Curated philosophical aphorisms with shareable quote cards (copy quote, Twitter/X share).
7. **Media (`/media`)**: Press interviews, podcast appearances, articles, and downloadable press liaison information.
8. **Events (`/events`)**: Scheduled literary readings, festival dialogues, and workshops separated by upcoming vs past archive.
9. **Search (`/search`)**: Fast site-wide instant search across all books, poems, essays, thoughts, media, and events with category filter tabs.
10. **Contact (`/contact`)**: Direct reader correspondence and press inquiry form with spam protection.
11. **Legal (`/privacy` & `/terms`)**: Comprehensive Privacy Policy and Terms of Use.

---

## 🔒 Admin CMS (`/admin`)

The `/admin` portal gives the author complete control over every aspect of the site:

- **Dashboard**: High-level metrics, quick action creation buttons (`+ Add Poem`, `+ Add Book`, `+ Add Essay`), and recent activity feed.
- **Books CMS (`/admin/books`)**: Create, edit, delete, publish/unpublish books, add purchase links (Amazon, Kindle, Barnes & Noble), page counts, ISBNs, and author notes.
- **Poetry CMS (`/admin/poetry`)**: Add new verses, format stanzas, set reading time, audio recitations, and categories.
- **Writings CMS (`/admin/writings`)**: Markdown-enabled rich essay editor with headings, blockquotes, categories, and canonical URLs.
- **Thoughts CMS (`/admin/thoughts`)**: Add and feature quotes and aphorisms.
- **Media CMS (`/admin/media`)**: Manage press releases, interviews, and podcast appearances.
- **Events CMS (`/admin/events`)**: Schedule upcoming readings, venues, online webinars, and RSVP links.
- **Review Moderation (`/admin/reviews`)**: Approve, feature, or delete reader reviews left on book pages.
- **Message Inbox (`/admin/messages`)**: Read, reply, and manage incoming messages from the contact form.
- **Subscribers (`/admin/subscribers`)**: Manage newsletter email list and export to CSV.
- **Author Profile (`/admin/profile`)**: Update biography, writing philosophy, statements, photos, and social links.
- **Site Settings & SEO (`/admin/settings`)**: Update global meta titles, keywords, Google Search Console verification token, Google Analytics ID, and admin password.

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/rahul20805/author.anantyadav.git
cd author.anantyadav
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="anant_yadav_literary_secure_session_secret_key_2026_pro"
ADMIN_EMAIL="admin@anantyadav.com"
ADMIN_PASSWORD="AnantAuthor@2026"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed

```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin) (Login with `admin@anantyadav.com` / `AnantAuthor@2026`)

---

## 🔍 Google Search Console & SEO Configuration

1. **Verify Ownership**:
   - Go to Google Search Console and copy your HTML verification token.
   - Log into `/admin/settings` and paste it under **Google Search Console Verification Token**.
2. **Submit Sitemap**:
   - In Search Console, submit your dynamic sitemap: `https://your-domain.com/sitemap.xml`.
3. **Structured Data Validation**:
   - Test any book, poem, or essay URL with the [Google Rich Results Test](https://search.google.com/test/rich-results) to verify `Person`, `Book`, and `Article` JSON-LD schemas.

---

## 📦 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set your environment variables in Vercel Project Settings:
   - `JWT_SECRET`: A secure random 32+ character string.
   - `ADMIN_EMAIL`: Your primary admin email.
   - `ADMIN_PASSWORD`: Your chosen secure initial password.
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g. `https://anantyadav.vercel.app`).
   - `DATABASE_URL`: `file:./dev.db` (for SQLite) or your PostgreSQL connection string (Supabase / Neon / Vercel Postgres).
4. Deploy!
