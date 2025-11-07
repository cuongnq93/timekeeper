# Deployment Guide - Cloudflare Pages

This guide covers deploying the TimeKeeper application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Wrangler CLI installed globally (optional for manual deployment)

## Option 1: Deploy via Git (Recommended)

This is the easiest method - Cloudflare Pages automatically builds and deploys when you push to your repository.

### Steps:

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Click **Connect to Git**
   - Select your repository

3. **Configure Build Settings**:
   ```
   Framework preset: Vue
   Build command: yarn build
   Build output directory: dist
   Root directory: /
   ```

4. **Set Environment Variables** (optional):
   - Click **Environment variables**
   - Add: `VITE_APP_URL` = `https://your-domain.pages.dev`

5. **Deploy**:
   - Click **Save and Deploy**
   - Wait for the build to complete

### Automatic Deployments

Once connected, every push to your main branch will automatically trigger a new deployment.

## Option 2: Deploy via Wrangler CLI

For manual deployments or CI/CD pipelines.

### 1. Install Wrangler

```bash
# Global installation
npm install -g wrangler

# Or use with yarn
yarn global add wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for authentication.

### 3. Deploy

```bash
# Build and deploy in one command
yarn deploy

# Or manually
yarn build
wrangler pages deploy dist --project-name=toastmaster-timer
```

### 4. First-time Deployment

If this is your first deployment, Wrangler will:
- Create a new Cloudflare Pages project
- Ask for the project name (default: `toastmaster-timer`)
- Deploy your site

### 5. Subsequent Deployments

For future deployments, simply run:

```bash
yarn deploy
```

## Configuration

### Environment Variables

Set environment variables in Cloudflare Pages dashboard:

1. Go to your Pages project
2. Navigate to **Settings** → **Environment variables**
3. Add variables:
   - `VITE_APP_URL`: Your production URL

### Custom Domain

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Follow the instructions to configure DNS

## Build Settings

The build configuration is defined in `wrangler.toml`:

```toml
name = "toastmaster-timer"
pages_build_output_dir = "dist"

[build]
command = "yarn build"
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn install

      - name: Build
        run: yarn build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=toastmaster-timer
```

### Required Secrets

Add these secrets to your GitHub repository:
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Verify Deployment

After deployment, test your PWA features:

1. **PWA Installation**: Visit your site and check for install prompt
2. **Offline Mode**: Disconnect internet and verify the app still works
3. **Service Worker**: Check DevTools → Application → Service Workers
4. **Performance**: Run Lighthouse audit (should score 100 for PWA)

## Troubleshooting

### Build Fails

If the build fails, check:
- All dependencies are listed in `package.json`
- TypeScript has no errors (`yarn build` locally)
- Node version matches (recommend Node 20+)

### PWA Not Working

Ensure:
- Site is served over HTTPS (Cloudflare Pages handles this automatically)
- `manifest.webmanifest` is accessible at `/manifest.webmanifest`
- Service worker is registered correctly

### Environment Variables Not Working

- Make sure variables are prefixed with `VITE_`
- Rebuild after changing environment variables
- Check the Variables are set for the correct environment (Production/Preview)

## Monitoring

Monitor your deployment:
- **Analytics**: Cloudflare Pages → Analytics
- **Logs**: Cloudflare Pages → Functions → View logs
- **Build History**: View all deployments and their status

## Rollback

To rollback to a previous version:
1. Go to your Pages project
2. Navigate to **Deployments**
3. Find the previous successful deployment
4. Click **⋮** → **Rollback to this deployment**

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Vue Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
