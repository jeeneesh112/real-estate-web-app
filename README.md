# SaaS Web Application

A modern React + Vite + TypeScript SaaS web application with role-based access control.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Material UI (MUI v5)** - Component library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Three.js** - 3D graphics (placeholder setup)

## Features

- 🔐 Role-based authentication (USER, CLIENT, ADMIN)
- 🎨 Material UI theming
- 🌍 Internationalization (i18n) support
- 📱 Responsive layout with Navbar, Sidebar, and Footer
- 🛡️ Protected routes based on user roles
- 🔄 Redux state management
- 📡 Axios interceptors for API calls

## Project Structure

```
src/
├── api/              # API service functions
├── components/       # React components
│   ├── layout/      # Layout components
│   ├── cards/       # Card components
│   ├── gallery/     # Gallery components
│   ├── map/         # Map components
│   ├── tour/        # Tour viewer components
│   ├── charts/      # Chart components
│   └── ui/          # UI components
├── pages/           # Page components
│   ├── auth/        # Authentication pages
│   ├── user/        # User role pages
│   ├── client/      # Client role pages
│   └── admin/       # Admin role pages
├── redux/           # Redux store and slices
├── theme/           # MUI theme configuration
├── i18n/            # Internationalization
├── utils/           # Utility functions
├── App.tsx          # Main app component with routing
└── main.tsx         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## User Roles

### USER
- Access to project listings
- Virtual tours
- Booking functionality

### CLIENT
- Dashboard with analytics
- Project management
- Tower and flat management
- Gallery
- Billing

### ADMIN
- System dashboard
- Client management
- Payment management
- System logs

## Development

The project uses TypeScript in strict mode. All components are written in `.tsx` files with proper type definitions.

### Key Patterns

- **Protected Routes**: Routes are protected based on user roles
- **i18n**: All text comes from translation files (no hardcoded strings)
- **Redux Slices**: State management organized by feature
- **Axios Interceptors**: Automatic token injection and error handling

## Next Steps

1. Implement actual API endpoints in `src/api/`
2. Add business logic to Redux slices
3. Create Three.js 3D tour implementation
4. Integrate Google Maps
5. Add chart libraries for analytics
6. Implement file upload for galleries
7. Add form validation
8. Create comprehensive test suite

## License

Private - All rights reserved
