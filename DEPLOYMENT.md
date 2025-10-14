# Deployment Guide

This guide covers deploying the KurdMatch platform to production.

## Prerequisites

- Supabase production project
- Domain name (optional)
- Hosting platform account (Vercel, Netlify, or similar)

## 🚀 Deployment Steps

### 1. Supabase Production Setup

#### Create Production Project
1. Go to https://supabase.com
2. Create a new project for production
3. Wait for project initialization (2-3 minutes)

#### Run Database Migrations
1. Navigate to SQL Editor in Supabase dashboard
2. Run all migrations from `supabase/migrations/` in chronological order
3. Verify tables are created correctly

#### Configure Authentication
1. Go to Authentication → Settings
2. Configure site URL: `https://yourdomain.com`
3. Add redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com` (for sign out)
4. Enable email provider or OAuth providers (Google, etc.)

#### Set Up Storage (if needed)
1. Go to Storage
2. Create buckets for:
   - `avatars` (public)
   - `post-media` (public)
   - `story-media` (public)
3. Set up storage policies for each bucket

#### Configure RLS Policies
Ensure all RLS policies are enabled and tested:
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 2. Environment Configuration

#### Production Environment Variables
Create `.env.production`:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

**Important**: Never commit production credentials to git!

### 3. Frontend Deployment

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Connect Repository**
   - Go to https://vercel.com
   - Import your Git repository
   - Vercel will auto-detect Vite

3. **Configure Build Settings**
   - Build Command: `npm run build` or `bun run build`
   - Output Directory: `dist`
   - Install Command: `npm install` or `bun install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Make sure they're available for Production environment

5. **Deploy**
```bash
vercel --prod
```

#### Option B: Netlify

1. **Connect Repository**
   - Go to https://netlify.com
   - Add new site from Git
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add both environment variables

4. **Deploy Settings**
   - Add `_redirects` file for SPA routing:
```
/* /index.html 200
```

#### Option C: Custom Server

1. **Build the application**
```bash
npm run build
```

2. **Serve static files**
Use any static file server (nginx, Apache, etc.)

Example nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Post-Deployment Setup

#### Create Admin User
1. Register a new account through the app
2. In Supabase SQL Editor, run:
```sql
-- Create super_admin role enum if not exists
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Assign super_admin role
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-from-auth-users', 'super_admin');
```

#### Configure System Settings
1. Login as admin
2. Navigate to `/admin/settings`
3. Configure:
   - Platform name and description
   - Support email
   - Feature toggles
   - Usage limits
   - Moderation settings

#### Test Critical Features
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Post creation and commenting
- [ ] Real-time notifications
- [ ] Image uploads
- [ ] Messaging
- [ ] Admin dashboard access

### 5. Performance Optimization

#### Enable Caching
Add caching headers in your hosting platform:
```
Cache-Control: public, max-age=31536000, immutable
```
for static assets (JS, CSS, images)

#### Configure CDN
Use a CDN for:
- Static assets
- Images
- Media files

#### Database Optimization
1. Add indexes for frequently queried columns:
```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id);
```

2. Enable connection pooling in Supabase

#### Image Optimization
Consider using an image CDN:
- Cloudinary
- imgix
- Supabase Storage with transforms

### 6. Monitoring & Maintenance

#### Set Up Monitoring
1. **Supabase Logs**
   - Monitor database queries
   - Check for slow queries
   - Review authentication logs

2. **Error Tracking**
   - Integrate Sentry or similar
   - Monitor JavaScript errors
   - Track API failures

3. **Analytics**
   - Set up platform analytics
   - Monitor user engagement
   - Track feature usage

#### Backup Strategy
1. **Database Backups**
   - Enable automatic backups in Supabase
   - Schedule daily backups
   - Test restore procedure

2. **Storage Backups**
   - Backup uploaded media regularly
   - Store backups off-site

#### Update Schedule
- Weekly security updates
- Monthly feature releases
- Quarterly major updates

### 7. Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] RLS policies tested and verified
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Content Security Policy (CSP) headers set
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] Admin access restricted
- [ ] Regular security audits scheduled

### 8. Domain Configuration

#### Custom Domain Setup
1. **Add domain to hosting platform**
   - Vercel: Project Settings → Domains
   - Netlify: Site Settings → Domain Management

2. **Configure DNS**
Add these records to your DNS provider:
```
Type    Name    Value
A       @       hosting-platform-ip
CNAME   www     your-app.vercel.app
```

3. **Update Supabase**
   - Update site URL in Authentication settings
   - Update redirect URLs

4. **Enable HTTPS**
   - Most platforms auto-provision SSL certificates
   - Verify certificate is valid and auto-renews

### 9. Scaling Considerations

#### Database Scaling
- Monitor connection pool usage
- Upgrade Supabase plan if needed
- Consider read replicas for high traffic

#### Application Scaling
- Use serverless functions for background tasks
- Implement caching strategies
- Use CDN for static assets

#### Storage Scaling
- Monitor storage usage
- Implement file size limits
- Use image compression

### 10. Rollback Plan

In case of deployment issues:

1. **Keep previous version accessible**
```bash
vercel rollback
```

2. **Database rollback procedure**
   - Keep migration backups
   - Document rollback SQL scripts
   - Test rollback in staging first

3. **Communication plan**
   - Notify users of maintenance
   - Provide status updates
   - Document incident

## Troubleshooting

### Common Issues

**Build fails**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check environment variables are set

**Database connection fails**
- Verify Supabase URL and anon key
- Check if RLS policies allow access
- Confirm network connectivity

**Images don't load**
- Check CORS configuration
- Verify storage bucket policies
- Confirm image URLs are correct

**Real-time not working**
- Enable Realtime in Supabase
- Check WebSocket connectivity
- Verify subscription setup

## Support

For deployment issues:
1. Check logs in hosting platform
2. Review Supabase logs
3. Consult platform documentation
4. Contact support if needed

---

**Remember**: Always test deployments in a staging environment before pushing to production!
