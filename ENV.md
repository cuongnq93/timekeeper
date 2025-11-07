# Environment Variables Guide

## Overview

This project uses environment variables to configure the application URL and other settings. This allows you to easily switch between development and production environments.

## Files

- **`.env`** - Local development environment (gitignored)
- **`.env.production`** - Production environment (committed to repo)
- **`.env.example`** - Template file with all available variables

## Setup

### For Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. The default development URL is already set:
   ```
   VITE_APP_URL=http://localhost:5173
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### For Production

1. Update `.env.production` with your actual domain:
   ```
   VITE_APP_URL=https://your-domain.com
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. The build process will automatically use `.env.production` values.

## Available Variables

### `VITE_APP_URL`
- **Description**: The full URL of your application
- **Development**: `http://localhost:5173`
- **Production**: `https://timekeeper.app` (update with your domain)
- **Used in**:
  - `index.html` meta tags (og:url, twitter:url, canonical)
  - JSON-LD structured data

### `VITE_APP_NAME`
- **Description**: Application name
- **Default**: `TimeKeeper`

## How It Works

Vite automatically replaces `%VITE_APP_URL%` placeholders in `index.html` with the actual value from your environment files during build time.

**Example in `index.html`:**
```html
<meta property="og:url" content="%VITE_APP_URL%/" />
<meta property="og:image" content="%VITE_APP_URL%/timekeeper-og-image.webp" />
```

**After build becomes:**
```html
<meta property="og:url" content="https://timekeeper.app/" />
<meta property="og:image" content="https://timekeeper.app/timekeeper-og-image.webp" />
```

## Additional Files to Update

When deploying to production, also update these files with your domain:

1. **`public/sitemap.xml`** - Update all URLs
2. **`public/robots.txt`** - Update sitemap URL

## Deployment Checklist

- [ ] Update `.env.production` with production URL
- [ ] Update `public/sitemap.xml` with production URLs
- [ ] Update `public/robots.txt` with production sitemap URL
- [ ] Run `npm run build`
- [ ] Test the build locally: `npm run preview`
- [ ] Deploy `dist/` folder to your hosting provider

## Notes

- `.env` file is gitignored for security
- `.env.production` is committed to the repo
- Always use `VITE_` prefix for environment variables in Vite
- Environment variables are replaced at build time, not runtime
