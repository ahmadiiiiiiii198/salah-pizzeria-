# ✅ Netlify Deployment Checklist

## 🔧 Pre-Deployment Setup

### **1. Build Configuration**
- [x] `netlify.toml` configured with correct settings
- [x] `package.json` has correct build scripts
- [x] `vite.config.ts` optimized for production
- [x] `_redirects` file in public folder for SPA routing

### **2. Environment Variables**
- [ ] `VITE_SUPABASE_URL` - Set in Netlify dashboard
- [ ] `VITE_SUPABASE_ANON_KEY` - Set in Netlify dashboard  
- [ ] `NODE_ENV=production` - Set in Netlify dashboard
- [ ] `VITE_APP_NAME` - Set in Netlify dashboard
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - (Optional) If using payments
- [ ] `VITE_GOOGLE_MAPS_API_KEY` - (Optional) If using maps

### **3. Code Quality**
- [x] TypeScript compilation passes (`npm run type-check`)
- [x] Build process completes successfully (`npm run build`)
- [x] No console errors in production build
- [x] All imports and dependencies resolved

## 🚀 Deployment Steps

### **Step 1: Connect Repository**
1. [ ] Go to [Netlify Dashboard](https://app.netlify.com)
2. [ ] Click "New site from Git"
3. [ ] Choose GitHub and authorize
4. [ ] Select your repository

### **Step 2: Configure Build Settings**
```
Base directory: negoziooo
Build command: npm run build
Publish directory: negoziooo/dist
Node version: 20
```

### **Step 3: Add Environment Variables**
Go to Site Settings → Environment Variables and add all required variables.

### **Step 4: Deploy**
1. [ ] Click "Deploy site"
2. [ ] Monitor build logs for any errors
3. [ ] Wait for deployment to complete (2-5 minutes)

## 🧪 Post-Deployment Testing

### **Functionality Tests**
- [ ] Homepage loads correctly
- [ ] Menu page displays all products by categories
- [ ] Category expansion/collapse works
- [ ] All navigation links work
- [ ] Contact information displays correctly
- [ ] Admin panel accessible (if applicable)
- [ ] No 404 errors on page refresh

### **Performance Tests**
- [ ] Page load speed < 3 seconds
- [ ] Images load properly
- [ ] Mobile responsiveness works
- [ ] No JavaScript errors in console

### **Database Connection**
- [ ] Products load from Supabase
- [ ] Categories display correctly
- [ ] Real-time updates work (if applicable)

## 🌐 Domain Configuration (Optional)

### **Custom Domain Setup**
1. [ ] Purchase domain from registrar
2. [ ] Add domain in Netlify: Site Settings → Domain Management
3. [ ] Configure DNS records:
   - [ ] CNAME: `www` → `your-site.netlify.app`
   - [ ] A Record: `@` → `75.2.60.5`
4. [ ] Wait for SSL certificate (up to 24 hours)
5. [ ] Test HTTPS redirect

## 🔒 Security & Performance

### **Security Features**
- [x] HTTPS enforcement enabled
- [x] Security headers configured
- [x] XSS protection enabled
- [x] Content type validation

### **Performance Optimizations**
- [x] Asset compression (Gzip/Brotli)
- [x] Code splitting implemented
- [x] Long-term caching for static assets
- [x] CDN distribution enabled

## 📊 Monitoring Setup

### **Analytics**
- [ ] Enable Netlify Analytics
- [ ] Set up Google Analytics (optional)
- [ ] Configure error tracking

### **Notifications**
- [ ] Set up build notifications (Slack/Email)
- [ ] Configure uptime monitoring
- [ ] Set up performance alerts

## 🐛 Troubleshooting

### **Common Issues & Solutions**

**Build Fails:**
- Check environment variables are set correctly
- Verify Node version is 20
- Check build logs for specific errors

**404 Errors:**
- Ensure `_redirects` file is in dist folder
- Check `netlify.toml` redirect configuration

**Slow Loading:**
- Verify CDN is working
- Check image optimization
- Monitor Core Web Vitals

**Database Connection Issues:**
- Verify Supabase URL and key
- Check network requests in browser dev tools
- Ensure RLS policies allow public access

## 📱 Mobile Testing

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify touch interactions
- [ ] Check responsive breakpoints
- [ ] Test menu functionality on mobile

## 🎯 SEO Optimization

- [ ] Meta tags present on all pages
- [ ] Open Graph tags configured
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Page titles and descriptions set

## 🔄 Continuous Deployment

### **Automatic Deployments**
- [ ] Main branch deploys to production
- [ ] Preview deployments for pull requests
- [ ] Branch deployments for testing

### **Rollback Plan**
- [ ] Know how to rollback to previous version
- [ ] Test rollback process
- [ ] Document deployment history

## ✅ Final Verification

### **Before Going Live**
- [ ] All functionality tested
- [ ] Performance meets requirements
- [ ] Security measures in place
- [ ] Backup strategy configured
- [ ] Team access set up
- [ ] Documentation updated

### **Launch Day**
- [ ] Announce to team
- [ ] Monitor for issues
- [ ] Check analytics setup
- [ ] Verify all integrations working
- [ ] Celebrate! 🎉

## 📞 Support Resources

- **Netlify Documentation**: https://docs.netlify.com
- **Netlify Status**: https://www.netlifystatus.com
- **Build Logs**: Available in Netlify dashboard
- **Community Support**: Netlify community forums

---

**Your pizzeria website is ready for production deployment!** 🍕

Follow this checklist step by step to ensure a smooth deployment process.
