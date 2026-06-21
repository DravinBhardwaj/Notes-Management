# 📘 AI-Powered Notes Management System

A full-stack **AI-Powered Notes Management System** built using **React (Vite)**, **Node.js (Express)**, **MongoDB Atlas**, **Cloudinary**, **LangChain**, **RAG** and **Google Gemini**.

The platform allows users to create notes, upload PDFs, generate summaries, generate important questions, and chat with documents using **Retrieval-Augmented Generation (RAG)**.


⚠️ The backend is hosted on Render's free tier and may take up to 50 seconds to wake up after inactivity.

---

# ✨ Features

## 🔐 Authentication & Authorization

* JWT Authentication
* HTTP-only Cookie Sessions
* Role-Based Access Control
* Protected Routes

### Roles

* Super Admin
* Group Admin
* User

---

## 👥 Group Management

* Create Groups
* Join Groups
* Group-wise Notes Access
* Group Admin Management
* Group Member Management

---

## 📝 Notes Management

### Rich Note Editor

* Multi-page note editor
* Custom page colors
* Auto-save drafts
* Date insertion
* Bullet insertion
* Page management

### PDF Generation

* Generate PDF from notes
* Download PDF
* Store PDFs securely on Cloudinary

### PDF Upload

* Upload existing PDFs
* Cloudinary storage
* Automatic PDF processing

---

# 🤖 AI Features

## 📄 AI Summary Generator

Generate concise revision-ready summaries from uploaded PDFs.

Features:

* Important points extraction
* Study-friendly formatting
* Quick revision notes
* Gemini powered

---

## ❓ AI Question Generator

Automatically generate important questions from uploaded documents.

Features:

* Exam-oriented questions
* Concept-based questions
* Revision preparation
* Interview preparation

---

## 💬 AI PDF Chat (RAG)

Ask questions directly from uploaded PDFs.

### Workflow

1. PDF Upload
2. Text Extraction
3. Page-wise Chunking
4. Embedding Generation
5. MongoDB Atlas Vector Search
6. Relevant Chunk Retrieval
7. Gemini Answer Generation

### Features

* Context-aware answers
* Source page references
* Chat history support
* Multi-turn conversation
* Document-grounded responses

---

# 🧠 Retrieval-Augmented Generation (RAG)

The project implements a complete RAG pipeline.

### Pipeline

PDF Upload
→ Text Extraction
→ Recursive Text Splitting
→ Chunk Storage
→ Embedding Generation
→ MongoDB Atlas Vector Search
→ Context Retrieval
→ Gemini LLM
→ Final Answer

---

# 🛠 Admin Features

## Super Admin

* Manage Users
* Manage Groups
* View System Statistics
* Enable/Disable Posting
* Assign Group Admins
* Remove Users

## Group Admin

* Manage Group Members
* Moderate Notes
* Group-level Control

---

# 🏗 Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* React Toastify
* React PDF
* PDF.js
* EmailJS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* PDFKit

## AI Stack

* Google Gemini 2.5 Flash
* LangChain
* MongoDB Atlas Vector Search
* Recursive Character Text Splitter
* Embeddings
* Retrieval-Augmented Generation (RAG)

## Storage

* Cloudinary

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# 📂 Project Structure

```text
Notes/
│
├── client/
│   ├── src/
│   │   ├── admin/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── providers/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🔥 Key Highlights

* Full MERN Stack Application
* AI-Powered PDF Understanding
* Complete RAG Implementation
* Vector Search with MongoDB Atlas
* PDF Chat Assistant
* AI Summary Generation
* AI Question Generation
* Role-Based Access Control
* Cloudinary PDF Storage
* Production Deployment (Render + Vercel)

---

# 📈 Future Improvements

* Notes Sharing
* Flashcard Generation
* AI Quiz Generation
* Semantic Search Across Notes
* Voice-to-Notes
* Multi-PDF Chat
* Study Analytics

---

# 👨‍💻 Author

**Dravin Bhardwaj**

B.Tech CSE | MERN Stack Developer | AI & RAG Enthusiast
