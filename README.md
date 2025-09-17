# Lendsqr User Management Dashboard

A modern React dashboard application for user management, built with TypeScript and SCSS. Features include user listing, detailed user profiles, filtering, pagination, and responsive design.

## Features

- **User Management**: Complete user listing with pagination and filtering
- **User Details**: Detailed user profiles with personal information, education, and guarantor details
- **Authentication**: Login/logout functionality with protected routes
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Filtering & Search**: Advanced filtering by organization, status, date, and more
- **Data Management**: Local storage integration for user data persistence
- **Modern UI**: Clean, professional interface with SCSS styling
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button/          # Button component
│   ├── Card/            # Card component
│   ├── Input/           # Input component
│   ├── Layout/          # Layout components (Navbar, Sidebar, DashboardLayout)
│   ├── StatsCards.tsx   # Statistics cards component
│   └── UsersTable/      # Users table with filtering and pagination
├── pages/               # Page components
│   ├── Login/           # Login page
│   ├── Users/           # Users listing page
│   └── UserDetails/     # User details page with sub-components
├── services/            # API and storage services
│   ├── userApi.ts       # User API service
│   └── localStorageService.ts # Local storage service
├── data/                # Mock data and types
│   ├── mockUsers.json   # Mock user data
│   └── mockUsers.ts     # User types and data processing
├── styles/scss/         # SCSS organization
│   ├── _variables.scss  # SCSS variables
│   ├── _mixins.scss     # SCSS mixins
│   ├── _base.scss       # Base styles and resets
│   ├── _components.scss # Global component styles
│   └── main.scss        # Main SCSS file
└── types/               # TypeScript type definitions
```

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.


## Technical Features

- **TypeScript**: Full type safety with interfaces for all data structures
- **SCSS Architecture**: Organized styles with variables, mixins, and modular structure
- **React Hooks**: Modern functional components with useState, useEffect, useRef
- **React Router**: Client-side routing with protected routes
- **Local Storage**: Data persistence for user details and authentication state
- **Mock API**: Simulated API calls with realistic delays and error handling

## 📱 Responsive Design

- Mobile-first responsive design
- Breakpoint mixins for consistent media queries
- Flexible grid and flexbox layouts
- Scalable typography system
- Touch-friendly interface elements

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Dependencies

- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and modern JavaScript features
- **React Router**: Client-side routing
- **Sass**: SCSS preprocessing
- **React Scripts**: Build tools and development server


## Authntication

- Use any email and password to login
- Once you logout, you will have to login again to view other pages

