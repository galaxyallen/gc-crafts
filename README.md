# GC CRAFTS — Full-Stack Website

Luxury jewelry display brand website built with Next.js 14, Prisma (SQLite), and NextAuth.

## Features

- **Public site (7 pages):** Homepage, Displays, Trays, Busts, Watches, OEM, Contact
- **Admin panel:** Products, Inquiries, Page content, Materials, Factory, Settings
- **Dynamic content** from SQLite database
- **Authentication** via NextAuth credentials
- **Image upload** via Cloudinary (optional)
- **Email notifications** via Resend (optional)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run database migration and seed
npx prisma migrate dev
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

Admin login: [http://localhost:3000/login](http://localhost:3000/login)

Default credentials (from `.env`):
- Email: `admin@gccrafts.com`
- Password: `admin123456`

## Images

Add product and hero images to `public/img/`:

- `hero-main.png`, `displays.webp`, `trays.webp`, `busts.jpg`, `watches.jpg`
- `factory.jpg`, `detail1.webp`, `detail2.webp`, `detail3.webp`, `detail4.jpg`, `detail5.jpg`

Reference HTML/CSS files are in `frontend-ref/`.

## Project Structure

```
app/
  (public)/     # Public pages
  admin/        # Admin panel (auth required)
  api/          # REST API routes
  login/        # Admin login
components/
  public/       # Public UI components
  admin/        # Admin UI components
prisma/         # Database schema & seed
lib/            # Utilities (prisma, auth, email, cloudinary)
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Build command: `prisma generate && prisma migrate deploy && next build`

## Notes

- Requires **64-bit Node.js** for local development (Next.js SWC compiler)
- On 32-bit Windows, deploy to Vercel or use 64-bit Node
- Cloudinary and Resend are optional; upload falls back to base64, emails log to console
