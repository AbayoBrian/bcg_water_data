# 🚀 Vercel Deployment Guide

This guide will walk you through deploying the Baringo Water Resource Mapping Dashboard to Vercel.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account to host your code
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Install Node.js (version 14 or higher)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository
1. Create a new GitHub repository
2. Upload all dashboard files to the repository:
   ```
   dashboard/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── package.json
   ├── vercel.json
   ├── README.md
   ├── baringo_water_points.geojson
   ├── baringo_water_clusters.geojson
   └── baringo_water_buffers.geojson
   ```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it as a static site

### Step 3: Configure Deployment
1. **Framework Preset**: Select "Other" or "Static Site"
2. **Root Directory**: Leave as default (or set to `dashboard` if files are in a subdirectory)
3. **Build Command**: Leave empty (not needed for static sites)
4. **Output Directory**: Leave empty (defaults to root)
5. **Install Command**: Leave empty

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 1-2 minutes)
3. Your dashboard will be available at `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to Dashboard Directory
```bash
cd dashboard
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Follow Prompts
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: `baringo-water-dashboard` (or your preferred name)
- **In which directory is your code located**: `./` (current directory)
- **Want to override the settings**: No

### Step 5: Access Your Dashboard
Your dashboard will be deployed to a URL like:
`https://baringo-water-dashboard-username.vercel.app`

## Method 3: Deploy from Local Files

### Step 1: Install Dependencies
```bash
cd dashboard
npm install
```

### Step 2: Test Locally
```bash
npm start
# or
npx serve .
```

### Step 3: Deploy
```bash
vercel --prod
```

## 🔧 Configuration Options

### Custom Domain
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables
If you need to add environment variables:
1. Go to project settings in Vercel
2. Navigate to "Environment Variables"
3. Add any required variables

### Build Settings
The dashboard is configured for static hosting, so no build process is needed. The `vercel.json` file handles all configuration.

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Enable Vercel Analytics in your project settings
2. Add the analytics script to your HTML if needed

### Performance Monitoring
- Vercel automatically provides performance metrics
- Check the "Analytics" tab in your project dashboard

## 🔄 Updating Your Dashboard

### Automatic Updates
- Push changes to your GitHub repository
- Vercel will automatically redeploy

### Manual Updates
```bash
vercel --prod
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Map Not Loading
- Check browser console for CORS errors
- Ensure GeoJSON files are in the correct location
- Verify file paths in `script.js`

#### 2. Charts Not Displaying
- Check if Chart.js is loading properly
- Verify chart container IDs match JavaScript
- Check for JavaScript errors in console

#### 3. Styling Issues
- Clear browser cache
- Check if CSS file is loading
- Verify Bootstrap CDN links

#### 4. Deployment Failures
- Check Vercel build logs
- Ensure all files are committed to Git
- Verify `vercel.json` configuration

### Debug Steps
1. **Check Console**: Open browser developer tools
2. **Network Tab**: Verify all resources are loading
3. **Vercel Logs**: Check deployment logs in Vercel dashboard
4. **Local Testing**: Test locally before deploying

## 📱 Mobile Optimization

The dashboard is already optimized for mobile devices, but you can:

1. **Test Responsiveness**: Use browser dev tools to test mobile views
2. **Touch Interactions**: Ensure all interactive elements work on touch devices
3. **Performance**: Monitor loading times on mobile networks

## 🔒 Security Considerations

### HTTPS
- Vercel automatically provides HTTPS
- No additional configuration needed

### Content Security Policy
- Configured in `vercel.json`
- Prevents XSS attacks
- Blocks unauthorized iframe embedding

### Data Protection
- GeoJSON data is public (no sensitive information)
- Consider data anonymization if needed

## 📈 Performance Optimization

### Vercel Edge Network
- Your dashboard is served from Vercel's global edge network
- Automatic CDN distribution
- Fast loading times worldwide

### Caching
- Static assets are automatically cached
- GeoJSON files are cached for performance
- Charts and maps load efficiently

## 🎯 Best Practices

### Code Organization
- Keep all files in the dashboard directory
- Use relative paths for local resources
- Maintain clean, readable code

### Data Management
- Keep GeoJSON files under 10MB for optimal loading
- Consider data compression for large files
- Update data regularly for accuracy

### User Experience
- Test on multiple devices and browsers
- Ensure accessibility compliance
- Provide clear navigation and instructions

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Dashboard Support
- Check the main README.md for technical details
- Review console errors for debugging
- Test locally before deploying changes

---

**Deployment Status**: ✅ Ready for Vercel  
**Compatibility**: Modern browsers with JavaScript enabled  
**Performance**: Optimized for global edge network delivery 