# SharkChat Deployment Guide

## Deploying on Render (Recommended)

### 1. Export Your Code
- Download your Replit project as a ZIP file
- Extract the files to your local machine
- Push the code to a GitHub repository

### 2. Create a Render Account
- Sign up for a free account at [render.com](https://render.com)

### 3. Create a New Web Service
- Click on "New" and select "Web Service"
- Connect your GitHub repository
- Select the branch you want to deploy

### 4. Configure Your Web Service
- **Name**: `sharkchat` (or choose your own)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Advanced Settings**:
  - Add an environment variable: 
    - Key: `NODE_ENV` 
    - Value: `production`

### 5. Deploy Your Application
- Click "Create Web Service"
- Render will build and deploy your application
- Your app will be available at `https://your-service-name.onrender.com`

## Alternative: Deploying on Railway

### 1. Create a Railway Account
- Sign up for a free account at [railway.app](https://railway.app)

### 2. Create a New Project
- Click on "New Project"
- Select "Deploy from GitHub repo"
- Connect your GitHub repository

### 3. Configure Your Project
- Railway should automatically detect your Node.js application
- Add an environment variable:
  - Key: `NODE_ENV`
  - Value: `production`

### 4. Deploy Your Application
- Railway will automatically build and deploy your application
- Your app will be available at the URL provided by Railway

## Alternative: Deploying on Glitch

### 1. Create a Glitch Account
- Sign up for a free account at [glitch.com](https://glitch.com)

### 2. Create a New Project
- Click on "New Project"
- Select "Import from GitHub"
- Enter your repository URL

### 3. Configure Your Project
- Glitch will automatically deploy your application
- Add an environment variable in .env:
  - `NODE_ENV=production`

### 4. View Your Application
- Click on "Share" to get your application URL
- Note: Glitch projects go to sleep after inactivity but wake up when accessed

## Troubleshooting

### WebSocket Connection Issues
- Ensure your deployment platform supports WebSockets
- Check the browser console for connection errors
- Verify your WebSocket URL is using the correct protocol (ws:// or wss://)

### Application Not Starting
- Check deployment logs for errors
- Verify the start command is correctly set
- Ensure all dependencies are properly installed

### Data Persistence
- By default, SharkChat uses in-memory storage
- Chat history will be lost when the server restarts
- For a production app, consider implementing a database