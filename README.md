# 🚀 MERN Stack Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack, featuring instant messaging, user authentication, and real-time updates.

## 📱 Live Demo

**Frontend:** [https://chat-app-six-livid-43.vercel.app](https://chat-app-six-livid-43.vercel.app)  
**Backend:** [https://chat-app-1-309y.onrender.com](https://chat-app-1-309y.onrender.com)

## 🖼️ Screenshots

### Home Page

![Home Page](./frontend/public/images/home.png)

### Individual User Chat

![Individual User Chat](./frontend/public/images/indivicual%20user.png)

## ✨ Features

- 🌟 **Modern Tech Stack**: MERN + Socket.io + TailwindCSS + DaisyUI
- 🔐 **Secure Authentication**: JWT-based authentication with protected routes
- 💬 **Real-time Messaging**: Instant messaging with Socket.io
- 🟢 **Online Status**: Live user presence indicators
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Modern UI/UX**: Gradient backgrounds, glassmorphism effects, and smooth animations
- 🔄 **Global State Management**: Zustand for efficient state management
- 🛡️ **Error Handling**: Comprehensive error handling on both client and server
- 🚀 **Production Ready**: Deployed on Vercel (Frontend) and Render (Backend)
- 📊 **Recent Messages**: Quick access to recent conversations
- 🔍 **User Search**: Find and connect with other users
- 📝 **Message Status**: Read receipts and message timestamps

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library for TailwindCSS
- **Socket.io Client** - Real-time communication
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sran4/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Start the application**

   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
mern-chat-app/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── socket/         # Socket.io configuration
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utility functions
│   │   └── zustand/    # State management
│   └── public/         # Static assets
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users` - Get all users for sidebar

### Messages

- `GET /api/messages/:id` - Get messages for a conversation
- `POST /api/messages/send/:id` - Send a message
- `PUT /api/messages/read/:id` - Mark messages as read
- `GET /api/messages/unread/counts` - Get unread message counts
- `GET /api/messages/recent/all` - Get recent messages

## 🌐 Deployment

This application is deployed using:

- **Frontend**: Vercel (https://vercel.com)
- **Backend**: Render (https://render.com)
- **Database**: MongoDB Atlas (https://cloud.mongodb.com)

### Deployment Features

- ✅ Cross-domain authentication with Authorization headers
- ✅ CORS configuration for production
- ✅ Environment variables for secure configuration
- ✅ Automatic deployments from GitHub

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Satwant Sran**

- GitHub: [@sran4](https://github.com/sran4)
- LinkedIn: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- Thanks to the MERN stack community
- Socket.io for real-time communication
- TailwindCSS for beautiful styling
- All the open-source contributors
