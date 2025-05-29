# MongoDB Setup Guide for Soucey

This guide will help you set up MongoDB for your Soucey food delivery application.

## Prerequisites

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Set up a new MongoDB cluster (the free tier is sufficient for development)

## Setting Up Your MongoDB Database

### Step 1: Create a MongoDB Atlas Cluster

1. Log in to your MongoDB Atlas account
2. Create a new project named "Soucey"
3. Create a new cluster (M0 Free Tier is sufficient for development)
4. Choose a cloud provider and region close to Ghana for optimal performance

### Step 2: Set Up Database Access

1. In the MongoDB Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Create a username and password (save these securely)
4. Set privileges to "Read and Write to Any Database"

### Step 3: Configure Network Access

1. Go to "Network Access" in the MongoDB Atlas dashboard
2. Click "Add IP Address"
3. For development, you can add your current IP address
4. For production, add the IP address of your production server
5. Alternatively, you can allow access from anywhere (not recommended for production)

### Step 4: Get Your Connection String

1. Go to "Databases" in the MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user's password

### Step 5: Configure Environment Variables

1. Create or update your `.env.local` file in the root directory of your project
2. Add the following line with your connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

## Database Structure

The application uses the following collections:

1. **users** - User information and profiles
2. **restaurants** - Restaurant details and information
3. **menuItems** - Menu items with prices and details
4. **orders** - Customer orders with items and delivery information
5. **payments** - Payment records linked to orders

## Testing Your Connection

To test your MongoDB connection:

1. Start your Next.js application
2. Try creating a new restaurant or menu item through the admin interface
3. Check the MongoDB Atlas dashboard to see if the data was saved correctly

## Troubleshooting

If you encounter connection issues:

1. Verify your connection string is correct in the `.env.local` file
2. Check that your IP address is whitelisted in the Network Access settings
3. Ensure your database user has the correct permissions
4. Check the server logs for specific error messages

## Migration from Firebase

If you're migrating from Firebase to MongoDB, you'll need to:

1. Export your data from Firebase (use the Firebase console or Firebase Admin SDK)
2. Transform the data to match the MongoDB schema
3. Import the data into MongoDB using the MongoDB import tools or programmatically

For assistance with data migration, please contact the development team.
