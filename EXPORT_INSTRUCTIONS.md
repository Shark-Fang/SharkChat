# How to Export and Deploy SharkChat

## Exporting Your Code

To export your SharkChat application from Replit:

1. **Download your code**:
   - In Replit, go to the "Files" panel
   - Right-click on the root folder
   - Select "Download as zip"

2. **Prepare for deployment**:
   - Extract the zip file on your local computer
   - Make sure you have Node.js installed locally

3. **Test locally** (optional):
   - Open a terminal in the extracted folder
   - Run `npm install` to install dependencies
   - Run `npm run dev` to start the development server
   - Open your browser to http://localhost:5000

## Free Deployment Options

### Option 1: Render (Recommended for WebSocket Support)

1. Create an account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect to your GitHub repository (or upload the code directly)
4. Configuration:
   - Build Command: `npm install`
   - Start Command: `NODE_ENV=production node -r tsx server/index.ts`
   - Environment Variables:
     - NODE_ENV: production

### Option 2: Railway

1. Create an account at [railway.app](https://railway.app)
2. Create a new project
3. Connect to your GitHub repository (or upload the code)
4. Railway should automatically detect your Node.js application
5. Set environment variables if needed (NODE_ENV=production)

### Option 3: Netlify (Requires some modifications)

Note: You'll need to adapt the code to work with Netlify Functions for the backend.

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

### Option 4: Vercel (Requires some modifications)

Note: You'll need to adapt the code to work with Vercel's serverless functions.

1. Create an account at [vercel.com](https://vercel.com)
2. Add a vercel.json file to your project
3. Push to GitHub and import your repository in Vercel

## Important Configuration Notes

1. Make sure WebSockets are supported by your chosen platform
2. For production, consider adding a persistent database instead of in-memory storage
3. Update the WebSocket connection URL in the frontend code if necessary

## Need More Help?

Refer to each platform's documentation for detailed deployment instructions:
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Vercel Documentation](https://vercel.com/docs)