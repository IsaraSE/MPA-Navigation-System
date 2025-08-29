# EcoNav MPA Frontend

A modern React-based frontend for the EcoNav Maritime Protected Area Navigation System, built with Tailwind CSS.

## Features

### Authentication
- **Login Page**: Secure user authentication with email and password
- **Register Page**: User registration with vessel information
- **Protected Routes**: Automatic redirection for unauthenticated users
- **JWT Token Management**: Secure token-based authentication

### User Interface
- **Modern Design**: Clean, responsive interface with maritime theme
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Toast Notifications**: User feedback for all operations
- **Loading States**: Smooth loading indicators throughout the app

### Dashboard
- **Welcome Section**: Personalized greeting with user information
- **Statistics Cards**: Key metrics display (Active Vessels, Protected Areas, etc.)
- **Quick Actions**: Easy access to main features
- **Recent Activity**: Real-time activity feed
- **Vessel Information**: Display user's vessel details

## Technology Stack

- **React 19.1.1**: Modern React with hooks
- **React Router DOM 6.8.0**: Client-side routing
- **Tailwind CSS 3.4.0**: Utility-first CSS framework
- **Axios 1.6.0**: HTTP client for API communication
- **React Hook Form 7.48.0**: Form handling and validation
- **React Hot Toast 2.4.1**: Toast notifications

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.js    # Authentication guard component
├── context/
│   └── AuthContext.js       # Authentication state management
├── pages/
│   ├── Login.js             # Login page
│   ├── Register.js          # Registration page
│   └── Dashboard.js         # Main dashboard/home page
├── services/
│   ├── api.js              # Axios configuration
│   └── authService.js      # Authentication API calls
├── App.js                  # Main app with routing
└── index.css               # Tailwind CSS imports
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Navigate to the frontend directory:
```bash
cd MPA-Navigation-System/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Integration

The frontend communicates with the backend through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User Data Structure
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  role: "captain", // sailor, captain, admin
  vesselName: "Ocean Explorer",
  vesselType: "cargo", // cargo, fishing, pleasure, tanker, passenger, other
  isActive: true
}
```

## User Roles

### Sailor
- Basic crew member
- Can view navigation data
- Limited system access

### Captain
- Vessel commander
- Enhanced navigation access
- Crew management capabilities

### Admin
- System administrator
- Full user management access
- System configuration privileges

## Vessel Types

- **Cargo**: Commercial cargo vessels
- **Fishing**: Fishing vessels
- **Pleasure**: Recreational vessels
- **Tanker**: Oil and chemical tankers
- **Passenger**: Passenger ships
- **Other**: Miscellaneous vessels

## Design System

### Colors
- **Primary**: Blue shades (#1e3a8a to #3b82f6)
- **Maritime**: Ocean blue shades (#0ea5e9 to #0284c7)
- **Success**: Green (#059669)
- **Warning**: Orange (#d97706)
- **Error**: Red (#dc2626)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean input fields with validation states
- **Cards**: White backgrounds with subtle shadows
- **Navigation**: Responsive header with user info

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Maintain responsive design
- Follow maritime theme styling
- Use Tailwind CSS utility classes

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` folder to your web server

3. Configure environment variables for production:
```bash
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Contributing

1. Follow the existing code structure
2. Use Tailwind CSS for styling
3. Add proper error handling
4. Test on multiple devices
5. Update documentation as needed

## License

This project is part of the EcoNav MPA Navigation System.
