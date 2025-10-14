# KurdMatch - Kurdish Social Network Platform

A comprehensive social networking platform designed to connect Kurdish people worldwide, built with modern web technologies and real-time features.

## 🚀 Features

### Core Social Features
- **User Profiles** - Detailed profiles with photos, bio, interests, and preferences
- **Discovery Feed** - Personalized content feed with posts, events, and trending topics
- **Swipe Matching** - Tinder-style profile browsing with like/pass functionality
- **Messaging** - Real-time chat with other users
- **Posts & Comments** - Create posts with media, comment threads, and engagement
- **Stories** - 24-hour ephemeral stories with reactions
- **Groups** - Create and join community groups
- **Events** - Create and attend local/virtual events

### Advanced Features
- **Advanced Search** - Multi-type search with filters (users, posts, groups, events)
- **Notifications** - Real-time notification center with activity tracking
- **Hashtags** - Trending hashtags and hashtag-based navigation
- **Saved Content** - Bookmark posts for later viewing
- **Profile Views** - Track who viewed your profile
- **Verification System** - Verified user badges

### Admin Dashboard
- **User Management** - Verify users, manage accounts
- **Content Moderation** - Review and delete posts/comments
- **Reports Management** - Handle user reports and violations
- **Platform Analytics** - Engagement metrics and user growth tracking
- **System Settings** - Configure platform-wide settings and limits

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **date-fns** - Date utilities

### Backend (Supabase)
- **PostgreSQL** - Primary database
- **Supabase Auth** - Authentication system
- **Row Level Security** - Database security policies
- **Real-time Subscriptions** - Live data updates
- **Storage** - File uploads and management

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kurdmatch
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Configure Supabase**
   - Project is already connected to Supabase
   - Project ID: `bqgjfxilcpqosmccextj`
   - Credentials are configured in `src/integrations/supabase/client.ts`

4. **Start development server**
```bash
npm run dev
# or
bun dev
```

5. **Open the app**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/                    # API integration modules
├── components/
│   ├── app/               # App-level components (routing, navigation)
│   ├── auth/              # Authentication components
│   ├── discovery/         # Discovery feed components
│   ├── notifications/     # Notification components
│   ├── swipe/            # Swipe interface components
│   └── ui/               # Reusable UI components (shadcn)
├── hooks/                 # Custom React hooks
├── integrations/
│   └── supabase/         # Supabase client and types
├── lib/                  # Utility functions
├── pages/
│   ├── admin/            # Admin dashboard pages
│   ├── Auth.tsx          # Authentication page
│   ├── Register.tsx      # Registration flow
│   ├── DiscoveryFeed.tsx # Main feed
│   ├── Messages.tsx      # Chat interface
│   └── ...               # Other pages
└── main.tsx              # Application entry point
```

## 📱 Main Routes

### Public Routes
- `/` - Landing page
- `/auth` - Login page
- `/register` - Registration flow

### Protected Routes
- `/discovery` - Main feed
- `/swipe` - Swipe interface
- `/messages` - Messaging
- `/my-profile` - User profile
- `/notifications` - Notification center
- `/search` - Advanced search
- `/groups` - Community groups
- `/events` - Event listings

### Admin Routes (Requires super_admin role)
- `/admin/dashboard` - Admin overview
- `/admin/users` - User management
- `/admin/reports` - Report management
- `/admin/content` - Content moderation
- `/admin/analytics` - Platform analytics
- `/admin/settings` - System settings

## 🔐 Security

### Row Level Security (RLS)
All tables implement RLS policies to ensure users can only:
- Read their own data and public content
- Modify their own content
- Access appropriate shared content

### Admin Access
- Separate `user_roles` table for role management
- Security definer functions to prevent RLS recursion
- Audit logging for all admin actions

## 📚 Documentation

Additional documentation:
- **[FEATURE_SUMMARY.md](FEATURE_SUMMARY.md)** - Detailed feature documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## 🎯 Quick Start Guide

### For Users
1. Register an account at `/register`
2. Complete your profile
3. Start swiping, posting, and connecting!

### For Admins
1. Register an account
2. Request super_admin role from database admin
3. Access admin dashboard at `/admin/dashboard`
4. Configure system settings at `/admin/settings`

## 🤝 Development

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

## 📊 Features by Phase

✅ **Phase 1-7**: Core social features (posts, comments, events, groups, stories)  
✅ **Phase 8**: Advanced search and filters  
✅ **Phase 9**: Notification system  
✅ **Phase 10-13**: Complete admin dashboard with analytics and settings  

## 🆘 Support

For issues and questions:
- Review documentation in this repository
- Check Supabase logs for backend issues
- Contact the development team

---

**Built with ❤️ for the Kurdish community**

## Project Info

**Lovable Project URL**: https://lovable.dev/projects/2c5b97e5-e3ff-4419-8c09-7d90137e1b71

### Edit via Lovable
Simply visit the [Lovable Project](https://lovable.dev/projects/2c5b97e5-e3ff-4419-8c09-7d90137e1b71) and start prompting. Changes made via Lovable will be committed automatically to this repo.

### Edit via IDE
Clone this repo and push changes. Pushed changes will also be reflected in Lovable.
