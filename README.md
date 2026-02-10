# 📘 Notes Management System

A full-stack **Notes Management System** built using **React (Vite)**, **Node.js (Express)**, **Cloudinary** and **MongoDB**.  
The project supports authentication, role-based access control, group management, PDF handling, and is fully deployable on free-tier hosting (Render + Vercel).

---

## 🚀 Live Demo

- Frontend:
- Backend API:

⚠️ On first load, the backend may take up to a minute to wake up (Render free tier).  
The UI will display **“Waking up server… please wait”** during this time.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- HTTP-only cookies
- Role-based access control:
  - superadmin
  - group admin
  - user

### 👥 Group Management
- Users belong to groups
- Group admins manage members
- Superadmin manages all users and groups

### 📝 Notes Management
- Create, edit, delete notes
- Group-scoped notes
- PDF generation and download
- PDF upload support

### 🛠 Admin Controls
- View system statistics
- Enable/disable posting globally
- Assign or revoke group admin roles
- Delete users

### 🌐 Production-Ready UX
- Backend cold-start handling
- Server wake-up loader
- Clean error handling

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify
- React-PDF / PDF.js

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt
- Multer
- PDFKit
- Cloudinary

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📁 Project Structure

Notes/
├── client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── admin/ # Super admin pages
│ │ ├── assets/ # Images & videos
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Auth context
│ │ ├── layouts/ # App layout wrappers
│ │ ├── pages/ # Application pages
│ │ ├── providers/ # Global providers
│ │ ├── utils/ # API helpers & utilities
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ ├── vite.config.js
│ └── package.json
│
├── server/ # Backend (Node + Express)
│ ├── controllers/ # Route logic
│ ├── middlewares/ # Auth & role middlewares
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── scripts/ # Maintenance scripts
│ ├── utils/ # DB, Cloudinary, Multer
│ ├── server.js # Entry point
│ └── package.json
│
├── .gitignore
└── README.md