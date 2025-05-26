# Firebase Setup Guide for Soucey

This guide will help you set up Firebase for your Soucey food delivery platform.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Name your project (e.g., "Soucey-Food-Delivery")
4. Enable Google Analytics if desired (optional)
5. Click "Create project"

## Step 2: Set Up Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development, test mode is easier)
4. Select a location closest to your users (e.g., for Ghana, you might choose "europe-west1")
5. Click "Enable"

## Step 3: Register Your Web App

1. In your Firebase project console, click on the gear icon next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" section and click the web icon (</>) to add a web app
3. Register your app with a nickname (e.g., "soucey-web")
4. Check "Also set up Firebase Hosting" if you plan to use it (optional)
5. Click "Register app"
6. You'll see your Firebase configuration - copy this for the next step

## Step 4: Configure Your Environment Variables

1. Create or update your `.env.local` file in the root of your project with the following Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the placeholder values with the actual values from your Firebase configuration.

## Step 5: Seed Your Database

1. After setting up your environment variables, navigate to the admin dashboard of your Soucey application
2. Click on the "Seed Database" button
3. This will populate your Firestore database with sample data for restaurants, menu items, orders, payments, and users

## Step 6: Security Rules (Optional but Recommended)

For production, you should set up security rules for your Firestore database:

1. In your Firebase project console, go to "Firestore Database" > "Rules"
2. Configure rules to secure your data. Here's a basic example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin users to read and write all documents
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Allow authenticated users to read restaurant and menu data
    match /restaurants/{restaurantId} {
      allow read: if request.auth != null;
    }
    
    match /menuItems/{menuItemId} {
      allow read: if request.auth != null;
    }
    
    // Allow users to read and write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Troubleshooting

- If you encounter CORS issues, make sure your Firebase project has the correct domain added in the Authentication > Sign-in method > Authorized domains section
- If you're getting authentication errors, check that your API keys are correctly set in your `.env.local` file
- For any Firestore permission issues, review your security rules

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js)
