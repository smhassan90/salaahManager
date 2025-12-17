# Privacy Policy & Terms of Service Setup Instructions

## 📄 Files Created

1. **`privacy-policy.html`** - Comprehensive Privacy Policy
2. **`terms-of-service.html`** - Complete Terms of Service

## 🌐 Hosting Options

You need to host these HTML files on a publicly accessible URL for Play Store submission. Here are your options:

### Option 1: GitHub Pages (Free & Easy)

1. Create a new GitHub repository (e.g., `alasr-manager-policies`)
2. Upload both HTML files to the repository
3. Go to Settings → Pages
4. Select source branch (usually `main`)
5. Your policies will be available at:
   - `https://yourusername.github.io/alasr-manager-policies/privacy-policy.html`
   - `https://yourusername.github.io/alasr-manager-policies/terms-of-service.html`

### Option 2: Vercel/Netlify (Free)

1. Create a new project
2. Upload both HTML files
3. Deploy
4. Get your URLs (e.g., `https://yourproject.vercel.app/privacy-policy.html`)

### Option 3: Your Own Website

1. Upload files to your web server
2. Ensure they're accessible via HTTPS
3. Note the URLs

### Option 4: Firebase Hosting (Free)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init hosting`
3. Copy HTML files to `public/` folder
4. Deploy: `firebase deploy --only hosting`
5. Get URLs from Firebase console

## ✏️ Customization Before Hosting

Before hosting, you may want to customize:

### In `privacy-policy.html`:
- **Line 11**: Update contact email (`privacy@alasrmanager.com`)
- **Line 12**: Verify app name matches your Play Store listing
- **Section 10**: Update third-party services if you use different ones

### In `terms-of-service.html`:
- **Line 11**: Update contact email (`support@alasrmanager.com`)
- **Line 12**: Verify app name matches your Play Store listing
- **Section 15**: Update jurisdiction if needed (currently uses generic language)

## 📱 Adding to Play Store Console

1. **Go to Google Play Console**
2. **Navigate to**: App Content → Privacy Policy
3. **Enter Privacy Policy URL**: `https://yourdomain.com/privacy-policy.html`
4. **Navigate to**: App Content → Terms of Service (if required)
5. **Enter Terms URL**: `https://yourdomain.com/terms-of-service.html`

## ✅ Verification Checklist

- [ ] Both files are hosted on HTTPS URLs
- [ ] URLs are publicly accessible (test in incognito mode)
- [ ] Contact emails are updated
- [ ] App name matches Play Store listing
- [ ] Privacy Policy URL added to Play Console
- [ ] Terms of Service URL added to Play Console (if required)
- [ ] Both pages display correctly on mobile devices

## 🔄 Updating Policies

When you update the policies:

1. Edit the HTML files
2. Update the "Last Updated" date (automatically set by JavaScript)
3. Re-upload to your hosting service
4. The changes will be live immediately

## 📧 Contact Information

Make sure the contact emails in both files are:
- Active and monitored
- Professional
- Related to your app/company

## 🎨 Styling

Both files include:
- Responsive design (works on mobile and desktop)
- Professional styling with your app's color scheme (#007F5F)
- Automatic date updates
- Print-friendly layout

## ⚠️ Important Notes

1. **Legal Review**: Consider having a lawyer review these documents before publishing
2. **Jurisdiction**: Update jurisdiction information if you have specific legal requirements
3. **Third-Party Services**: Update the list of third-party services to match what you actually use
4. **Data Collection**: Ensure the Privacy Policy accurately reflects what data you collect
5. **Regular Updates**: Review and update policies regularly, especially when adding new features

## 🚀 Quick Start (GitHub Pages)

```bash
# 1. Create new GitHub repo
# 2. Clone it
git clone https://github.com/yourusername/alasr-manager-policies.git
cd alasr-manager-policies

# 3. Copy files
cp ../privacy-policy.html .
cp ../terms-of-service.html .

# 4. Commit and push
git add .
git commit -m "Add privacy policy and terms of service"
git push origin main

# 5. Enable GitHub Pages in repo settings
# 6. Your URLs will be:
# https://yourusername.github.io/alasr-manager-policies/privacy-policy.html
# https://yourusername.github.io/alasr-manager-policies/terms-of-service.html
```

---

**Your policies are ready to host!** Choose your preferred hosting option and add the URLs to your Play Store Console.


