# LocalLens Frontend

A modern, full-featured tourism platform frontend built with Next.js, React, TypeScript, and Redux Toolkit. LocalLens provides an intuitive interface for tourists to discover and book tours, guides to manage their listings, and administrators to oversee the platform.

## 📋 Short Description

LocalLens Frontend is a Next.js application that provides a comprehensive user interface for a tourism platform. It enables tourists to explore and book tours, guides to create and manage tour listings, and administrators to manage the entire system. The application features role-based navigation, dynamic dashboards, and seamless integration with the LocalLens backend API.

## 🌐 Live URLs

- **Frontend Application**: [https://local-lens-frontend.vercel.app/](https://local-lens-frontend.vercel.app/)
- **Backend API**: [https://local-lens-backend.vercel.app/](https://local-lens-backend.vercel.app/)

## 🚀 Key Features

- **Role-Based User Interface**: Dynamic navigation and dashboards for Tourists, Guides, and Admins
- **Tour Discovery**: Advanced search and filtering with multiple categories and price ranges
- **Booking Management**: Complete booking workflow with date/time selection and payment integration
- **Tour Management**: Create, edit, and manage tour listings with image uploads
- **Wishlist System**: Save and manage favorite tours
- **Review & Rating**: Post-tour reviews and ratings with moderation
- **Profile Management**: Comprehensive profile pages with role-specific features
- **Payment Integration**: SSL Commerz payment gateway integration
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Real-time Updates**: Live booking status updates and notifications

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 16.0.8** - React framework with App Router
- **TypeScript 5.x** - Type safety

### **State Management**
- **Redux Toolkit** - State management
- **RTK Query** - Server state management with caching
- **React Redux** - React bindings for Redux

### **UI & Styling**
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Tabler Icons** - Additional icon set

### **Form Handling**
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### **HTTP Client**
- **Axios** - HTTP client with interceptors

### **Notifications**
- **React Hot Toast** - Toast notification system

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **PostCSS** - CSS processing

## 📄 Frontend Pages

### **Authentication Pages** (`/app/(auth)/`)
- `/login` - User login page
- `/register` - Registration redirect page
- `/register/tourist` - Tourist registration page
- `/register/guide` - Guide registration page

### **Public Pages** (`/app/(main)/`)
- `/` - Landing/home page
- `/explore` - Advanced tour discovery with filters
- `/explore-tours` - Basic tour browsing page
- `/tours/[slug]` - Tour details page with booking widget
- `/profile` - Own profile page
- `/profile/[id]` - Public profile page (role-based)
- `/my-bookings` - User bookings page
- `/payment/success` - Payment success page
- `/payment/fail` - Payment failure page
- `/payment/cancel` - Payment cancellation page

### **Admin Pages** (`/app/(main)/admin/`)
- `/admin/users` - User management interface
- `/admin/listings` - Listing management interface
- `/admin/bookings` - Booking oversight page

### **Dashboard Pages** (`/app/(dashboard)/dashboard/`)
- `/dashboard` - Main dashboard (role-based)
- `/dashboard/profile` - Profile management page
- `/dashboard/create-tour` - Tour creation page (Guide)
- `/dashboard/edit-tour/[id]` - Tour editing page (Guide)
- `/dashboard/my-tours` - My tours listing (Guide)
- `/dashboard/my-all-tours` - All tours overview (Guide)
- `/dashboard/listings` - Comprehensive listing management (Guide)
- `/dashboard/upcoming-bookings` - Upcoming bookings (Tourist/Guide)
- `/dashboard/pending-bookings` - Pending booking requests (Guide)
- `/dashboard/guide-upcoming-bookings` - Guide's upcoming bookings
- `/dashboard/past-bookings` - Past bookings history (Tourist)
- `/dashboard/my-trips` - Trip management (Tourist)
- `/dashboard/wishlist` - Wishlist management (Tourist)
- `/dashboard/tour-details/[id]` - Tour details in dashboard context
- `/dashboard/all-users` - User management (Admin)
- `/dashboard/all-listings` - All listings management (Admin)
- `/dashboard/all-bookings` - All bookings oversight (Admin)

## 🏗️ Project Architecture

### **Route-Based Architecture (App Router)**
```
app/
├── (auth)/                    # Authentication group routes
│   ├── login/                 # Login page
│   └── register/             
│       ├── page.tsx          # Redirect to tourist registration
│       ├── tourist/          # Tourist registration flow
│       └── guide/            # Guide registration flow
├── (dashboard)/              # Protected dashboard routes with sidebar
│   ├── dashboard/
│   │   ├── page.tsx         # Main dashboard
│   │   ├── all-users/       # Admin: User management
│   │   ├── all-listings/    # Admin: Listing management  
│   │   ├── all-bookings/    # Admin: Booking oversight
│   │   ├── create-tour/     # Guide: Tour creation
│   │   ├── my-tours/        # Guide: Tour management
│   │   ├── upcoming-bookings/ # Guide: Booking management
│   │   ├── pending-bookings/  # Guide: Pending requests
│   │   ├── my-trips/          # Tourist: Trip planning
│   │   ├── past-bookings/     # Tourist: Trip history
│   │   ├── wishlist/          # Tourist: Saved tours
│   │   └── listings/          # Guide: Comprehensive listing management
│   └── layout.tsx           # Dashboard layout with sidebar
├── (main)/                  # Public routes with navbar
│   ├── layout.tsx          # Main layout with navbar/footer
│   ├── page.tsx            # Landing page
│   ├── explore/            # Advanced tour discovery with filters
│   ├── explore-tours/      # Basic tour browsing
│   ├── tours/[slug]/       # Detailed tour pages with booking
│   ├── profile/            # User profile management
│   │   └── [id]/           # Dynamic profile pages (role-based)
│   └── admin/              # Admin-specific public pages
│       ├── users/          # User management interface
│       └── listings/       # Listing management interface
├── layout.tsx              # Root layout with providers
└── globals.css             # Global styles and design system
```

### **Component Architecture**
```
components/
├── ui/              # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── sidebar.tsx
│   └── resizable-navbar.tsx
├── NavFooter/       # Feature-specific components
├── provider/        # Context providers
└── [feature-components] # Business logic components
```

### **State Management Architecture**
```
redux/
├── store.ts         # Store configuration
├── baseApi.ts       # RTK Query base API
├── axiosBaseQuery.ts # Custom Axios integration
├── hooks.ts         # Typed hooks
└── features/
    └── auth/
        └── auth.api.ts # Feature-specific API slice
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Backend API server running (see backend README)

### **Installation**
```bash
# Navigate to frontend directory
cd /Documents/workspace/level-2/local-lens-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure API endpoints to point to your backend
# Example: NEXT_PUBLIC_BASE_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### **Environment Configuration**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Available Scripts**
```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔗 Related Repositories

**Backend API**: [`~/Documents/workspace/level-2/localLens-backend`](~/Documents/workspace/level-2/localLens-backend)
- Node.js/Express backend API
- Provides RESTful endpoints for this frontend
- Handles authentication, business logic, and database operations

## 📝 Summary

LocalLens Frontend demonstrates a **modern, production-ready React application** with:

- **Modern Architecture**: Leveraging Next.js 16 App Router with advanced patterns
- **Type Safety**: Comprehensive TypeScript implementation throughout
- **Scalable Design**: Modular, maintainable component architecture
- **Performance**: Optimized for speed with code splitting and caching
- **Developer Experience**: Excellent tooling and development workflow
- **Security**: Robust authentication and input validation
- **Accessibility**: Radix UI components with built-in accessibility
- **Role-Based UI**: Dynamic interfaces that adapt to user roles
- **Full-Stack Integration**: Seamless communication with backend API

The project showcases professional frontend development practices suitable for production environments, with comprehensive feature coverage for a tourism platform.
