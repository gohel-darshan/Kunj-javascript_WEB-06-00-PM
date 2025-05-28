# Forgot Password Flow with Google and Apple Authentication

This project implements a complete forgot password flow with multiple steps and social authentication options.

## Features

- Login page with email/password authentication
- Google Sign-In integration (demo mode)
- Apple Sign-In integration (demo mode)
- Multi-step forgot password flow:
  1. Email verification
  2. OTP verification
  3. New password creation
  4. Success confirmation

## Important Note for Demo Version

**This demo version uses simulated Google and Apple authentication.** The buttons will demonstrate the flow without requiring real API credentials. In a production environment, you would need to set up real authentication as described below.

## Setup Instructions

### Basic Setup

1. Clone the repository
2. Open `login.html` in your browser to start the application

### Setting up Real Authentication (For Production)

This application is configured to work with real Google and Apple authentication. To set up your own authentication credentials:

1. Open `login.html` and replace `REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Google Client ID
2. Open `login.js` and replace `REPLACE_WITH_YOUR_APPLE_CLIENT_ID` with your actual Apple Services ID

For detailed step-by-step instructions on setting up authentication, see the [Authentication Setup Guide](AUTHENTICATION_SETUP.md).

## File Structure

- `login.html` - Main login page with social authentication
- `login-styles.css` - Styles for the login page
- `login.js` - JavaScript for the login functionality
- `index.html` - Forgot password flow
- `styles.css` - Styles for the forgot password flow
- `script.js` - JavaScript for the forgot password functionality
- `redirect.html` - Redirect page to the login

## Testing

For testing purposes, fallback buttons are provided that simulate the authentication flow without requiring actual API credentials.

## Notes for Production

Before deploying to production:

1. Replace the placeholder client IDs with your actual credentials
2. Implement server-side validation and authentication
3. Set up proper error handling and logging
4. Configure HTTPS for secure communication
5. Implement CSRF protection
6. Consider adding rate limiting for security