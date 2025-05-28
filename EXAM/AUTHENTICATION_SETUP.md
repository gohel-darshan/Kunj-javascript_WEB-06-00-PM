# Setting Up Real Authentication

This guide provides detailed instructions for setting up real Google and Apple authentication for your application.

## Google Authentication Setup

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a name for your project and click "Create"

### Step 2: Configure OAuth Consent Screen
1. In your project, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace organization)
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Click "Save and Continue"
5. Add the scopes you need (at minimum, include `.../auth/userinfo.email` and `.../auth/userinfo.profile`)
6. Click "Save and Continue"
7. Add test users if needed, then click "Save and Continue"

### Step 3: Create OAuth Client ID
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your client
5. Add authorized JavaScript origins:
   - For development: `http://localhost:8000` (or whatever port you're using)
   - For production: `https://yourdomain.com`
6. Click "Create"
7. Note your Client ID (it will look like `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`)

### Step 4: Update Your Code
1. Open `login.html`
2. Find the `g_id_onload` div
3. Replace `REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID

## Apple Authentication Setup

### Step 1: Enroll in the Apple Developer Program
1. If you haven't already, enroll in the [Apple Developer Program](https://developer.apple.com/programs/)

### Step 2: Create an App ID
1. Go to the [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Select "Identifiers" from the sidebar
4. Click the "+" button to add a new identifier
5. Select "App IDs" and click "Continue"
6. Select "App" as the type and click "Continue"
7. Enter a description and Bundle ID (e.g., `com.yourcompany.app`)
8. Scroll down to "Capabilities" and check "Sign In with Apple"
9. Click "Continue" and then "Register"

### Step 3: Create a Services ID
1. Go back to "Identifiers" and click the "+" button
2. Select "Services IDs" and click "Continue"
3. Enter a description and identifier (e.g., `com.yourcompany.app.service`)
4. Check "Sign In with Apple" and click "Configure"
5. Select your App ID from the dropdown
6. Add your domain to the "Domains and Subdomains" field (e.g., `yourdomain.com`)
7. Add your return URL to the "Return URLs" field (e.g., `https://yourdomain.com/auth/apple/callback`)
8. Click "Next" and then "Continue"
9. Click "Register"

### Step 4: Create a Web Authentication Key
1. Go to "Keys" in the sidebar and click the "+" button
2. Enter a name for your key
3. Check "Sign In with Apple" and click "Configure"
4. Select your App ID from the dropdown
5. Click "Save" and then "Continue"
6. Click "Register"
7. Download the key file (you'll only be able to do this once)
8. Note the Key ID

### Step 5: Update Your Code
1. Open `login.js`
2. Find the `initializeAppleSignIn` function
3. Replace `REPLACE_WITH_YOUR_APPLE_CLIENT_ID` with your Services ID (e.g., `com.yourcompany.app.service`)

## Testing Your Authentication

### Testing Google Sign-In
1. Make sure you've added yourself as a test user in the OAuth consent screen
2. Open your application in a browser
3. Click the "Continue with Google" button
4. You should see the Google sign-in popup
5. After signing in, the `handleGoogleSignIn` function will be called with your user information

### Testing Apple Sign-In
1. Open your application in a browser
2. Click the "Continue with Apple" button
3. You should see the Apple sign-in popup
4. After signing in, the `AppleIDSignInOnSuccess` event will be triggered with your user information

## Troubleshooting

### Google Sign-In Issues
- Make sure your domain is correctly added to the authorized JavaScript origins
- Check the browser console for any errors
- Verify that you're using the correct Client ID
- Ensure the Google Sign-In API is loaded properly

### Apple Sign-In Issues
- Apple Sign-In requires HTTPS in production
- Make sure your domain verification is complete
- Check that your Services ID and configuration are correct
- Verify that the Apple Sign-In JS API is loaded properly

## Security Considerations

1. **Server-side Validation**: Always validate authentication tokens on your server
2. **HTTPS**: Use HTTPS for all authentication flows
3. **State Parameter**: Use the state parameter to prevent CSRF attacks
4. **Scope Limitation**: Only request the scopes you need
5. **Token Storage**: Store tokens securely and refresh them as needed
6. **Error Handling**: Implement proper error handling for authentication failures