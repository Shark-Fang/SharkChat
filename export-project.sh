#!/bin/bash

# Create a temporary directory for the export
mkdir -p ./export-temp

# Copy project files (excluding node_modules, git files, and other unnecessary files)
cp -r ./client ./export-temp/
cp -r ./server ./export-temp/
cp -r ./shared ./export-temp/
cp *.json ./export-temp/
cp *.ts ./export-temp/
cp *.js ./export-temp/
cp *.md ./export-temp/ 2>/dev/null || :
cp .gitignore ./export-temp/ 2>/dev/null || :

# Remove node_modules if they were copied
rm -rf ./export-temp/node_modules

# Create README with deployment instructions
cat > ./export-temp/README.md << 'EOL'
# SharkChat - Real-time Chat Application

A Google Chat-like web application that allows users to chat in real-time using a simple shareable link.

## Features

- Real-time messaging with WebSockets
- Username selection
- Emoji support
- Mobile-responsive design
- Shareable chat room links
- User join/leave notifications
- Connection status indicator

## Deployment Instructions

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at http://localhost:5000

### Deployment Options

#### Option 1: Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Set environment variable NODE_ENV=production

#### Option 2: Netlify + Netlify Functions

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Set the build command: `npm run build`
4. Set the publish directory: `client/dist`
5. Add a netlify.toml file for function configuration

#### Option 3: Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel should auto-detect the configuration
4. If needed, set the build command: `npm run build`

#### Option 4: Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Railway will automatically deploy your application
4. Set environment variables if needed

## Important Notes

- This application uses in-memory storage by default, so chat history will be lost on server restart
- For production use, consider implementing a persistent database storage solution
EOL

# Create a deployment.md file with platform-specific instructions
cat > ./export-temp/DEPLOYMENT.md << 'EOL'
# Deployment Guide for SharkChat

## Preparing Your App for Deployment

Before deploying to any platform, make sure to:

1. Set NODE_ENV=production in your environment variables
2. Consider implementing a persistent database instead of in-memory storage

## Platform-Specific Instructions

### Render

1. Create an account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect to your GitHub repository (or upload the code directly)
4. Configuration:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - NODE_ENV: production
     - PORT: 10000 (Render will automatically set the PORT)

### Netlify

1. Create an account at [netlify.com](https://netlify.com)
2. Add a netlify.toml file to your project:
   ```toml
   [build]
     command = "npm run build"
     publish = "client/dist"
   
   [functions]
     directory = "netlify/functions"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/server/:splat"
     status = 200
   ```
3. Create a netlify/functions directory
4. Move your server code to netlify/functions/server.js (adapt as needed)
5. Push to GitHub and connect your repository in Netlify

### Vercel

1. Create an account at [vercel.com](https://vercel.com)
2. Add a vercel.json file to your project:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "client/package.json", "use": "@vercel/static-build" },
       { "src": "server/index.ts", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "server/index.ts" },
       { "src": "/(.*)", "dest": "client/dist/$1" }
     ]
   }
   ```
3. Push to GitHub and import your repository in Vercel

### Railway

1. Create an account at [railway.app](https://railway.app)
2. Create a new project and connect your GitHub repository
3. Railway should automatically detect your Node.js application
4. Set environment variables if needed

## Troubleshooting

- If you encounter issues with WebSockets, make sure your platform supports them
- Check the platform-specific documentation for any limitations
- Some platforms may require additional configuration for real-time communication
EOL

# Create a zip file of the project
cd ./export-temp
zip -r ../sharkchat-export.zip .
cd ..

# Remove the temporary directory
rm -rf ./export-temp

echo "Export complete! Your project has been saved to sharkchat-export.zip"