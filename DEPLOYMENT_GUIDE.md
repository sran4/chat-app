# 🚀 Chat App Deployment Guide

## 📋 Overview

This guide covers deploying the Chat App with separated frontend (Vercel) and backend (Render).

## 🏗️ Architecture

- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express + Socket.io → Render
- **Database**: MongoDB Atlas (or Render's managed MongoDB)

---

## 🔧 LOCAL TESTING SETUP

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in backend directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in frontend directory:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start frontend development server:
   ```bash
   npm run dev
   ```

### Testing Locally

- Backend should run on: http://localhost:5000
- Frontend should run on: http://localhost:3000
- Test all features: login, signup, messaging, real-time updates

---

## 🌐 DEPLOYMENT

### Backend Deployment (Render)

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Create New Web Service**:

   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Use these settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Environment Variables** (in Render dashboard):

   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-jwt-secret
   PORT=10000
   ```

4. **Database Setup**:

   - Option A: Use MongoDB Atlas (recommended)
   - Option B: Use Render's managed MongoDB service

5. **Deploy**: Click "Create Web Service"

### Frontend Deployment (Vercel)

1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:

   - Connect your GitHub repository
   - Select the `frontend` folder as root directory
   - Framework: Vite

3. **Environment Variables** (in Vercel dashboard):

   ```
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   VITE_SOCKET_URL=https://your-backend-app.onrender.com
   ```

4. **Deploy**: Click "Deploy"

---

## 🔗 POST-DEPLOYMENT CONFIGURATION

### Update CORS Settings

After deploying, update the backend CORS settings in `backend/socket/socket.js` to include your actual Vercel URL:

```javascript
origin: [
  "http://localhost:3000", // Development
  "https://your-app-name.vercel.app", // Production Vercel
  "https://your-app-name-git-main.vercel.app", // Vercel preview
];
```

### Test Production Deployment

1. Test frontend: https://your-app-name.vercel.app
2. Test backend API: https://your-backend-app.onrender.com/api/auth/login
3. Test socket connection: Check browser console for socket connection
4. Test full functionality: login, signup, messaging

---

## 🐛 TROUBLESHOOTING

### Common Issues

1. **CORS Errors**:

   - Ensure backend CORS includes your Vercel URL
   - Check that credentials: true is set in socket config

2. **Socket Connection Issues**:

   - Verify VITE_SOCKET_URL points to your Render backend
   - Check Render logs for socket connection errors

3. **API Connection Issues**:

   - Verify VITE_API_BASE_URL points to your Render backend
   - Check that all API endpoints are working

4. **Environment Variables**:
   - Ensure all required env vars are set in both platforms
   - Check that Vite env vars start with VITE\_

### Debugging Steps

1. Check browser console for errors
2. Check Render logs for backend errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with curl/Postman

---

## 📁 PROJECT STRUCTURE AFTER SPLIT

```
chat-app/
├── backend/                 # Backend (Render)
│   ├── package.json        # Backend dependencies
│   ├── server.js          # Main server file
│   ├── render.yaml        # Render deployment config
│   └── env.example        # Environment template
├── frontend/              # Frontend (Vercel)
│   ├── package.json       # Frontend dependencies
│   ├── vercel.json        # Vercel deployment config
│   ├── src/config/api.js  # API configuration
│   └── env.example        # Environment template
└── DEPLOYMENT_GUIDE.md    # This guide
```

---

## ✅ SUCCESS CRITERIA

Your deployment is successful when:

- [ ] Backend runs independently on Render
- [ ] Frontend runs independently on Vercel
- [ ] API calls work from frontend to backend
- [ ] Socket connections work for real-time messaging
- [ ] All features work: login, signup, messaging
- [ ] No CORS errors in browser console
- [ ] Environment variables are properly configured

---

## 🆘 SUPPORT

If you encounter issues:

1. Check this guide first
2. Review Render and Vercel documentation
3. Check browser console and server logs
4. Verify all environment variables are set correctly
