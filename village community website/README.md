# Village Community Platform

This is a modern, full-stack Village Community Website built with React, Vite, Node.js, Express, and MongoDB.

## Features

1. **Village Market**: Browse and purchase local products (vegetables, fruits, dairy, handicrafts) dynamically. Includes category filtering and shopping cart capabilities.
2. **Admin Dashboard**: Secure panel to manage users, add/edit market products, manage categories, and review contact submissions. 
3. **Interactive Features**: Announcements, job boards, community funding projects, and local skill listings.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT Authentication, Multer

## Project Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas URI)

### Installation

1. Install dependencies for the full-stack project:
   ```bash
   npm install
   ```

2. Configure environment variables.
   Create a `.env` file in the root directory:
   ```env
   # Database connection string
   MONGODB_URI=mongodb://localhost:27017/villagecommunity
   # JWT secret for authentication
   JWT_SECRET=supersecretjwtkey_replace_me
   ```

### Running Locally

This project uses `concurrently` to run both the frontend and backend servers together.

- To start developing:
  ```bash
  # Starts Vite frontend on port 5173
  # Starts Express server on port 5000
  npm run dev:full
  ```

- Or manually run them separately:
  ```bash
  # Start UI
  npm run dev
  
  # Start API
  npm run server
  ```

## Deploying To Render

This repository is configured to run on Render as a single Node web service that builds the Vite frontend and serves it from Express.

1. Push the project to GitHub.
2. In Render, create a new `Blueprint` or `Web Service` from the repo.
3. Render will use:
   ```bash
   build: npm ci && npm run build
   start: npm start
   ```
4. Add these environment variables in Render:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_long_random_secret
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Important Note About Uploads

Product images and resumes are stored on the local filesystem. On a free Render web service, local files are ephemeral and may disappear after a redeploy or restart.

For persistent uploads, use one of these:
- Attach a Render disk and set `UPLOAD_DIR` to the mounted uploads folder.
- Move uploads to cloud storage such as Cloudinary, S3, or Supabase Storage.

## Folder Structure

*(Note: Currently undergoing restructuring!)*
- `src/` - Frontend React application (components, pages, context)
- `server/` - Backend API (models, routes, controllers, middleware)
- `public/` - Static assets and media uploads

## License

All rights reserved.
