# 🗨️ Chatterbox – Real-Time Chat App

🚀 A real-time chat application built using **React**, **Node.js**, and **Socket.io** for instant messaging. Designed as a resume-ready MERN-style project with real-time WebSocket functionality.

---

## ✨ Features

- 🔥 Real-time messaging via **WebSockets (Socket.io)**
- ⚡ Lightweight **Express.js backend**
- 🎨 Responsive **React frontend** with live updates
- 🧠 Username support (set your name and chat instantly)
- 🛠 Simple and clean UI

---

## 📌 Tech Stack

- **Frontend**: React, Vite, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Deployment**: Render (Backend), Vercel/Netlify (Frontend)

---

## 📂 Project Structure

```
chatterbox/
├── frontend/        # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   ├── package.json
│   └── vite.config.js
├── backend/         # Express + Socket.io backend
│   ├── index.js
│   ├── package.json
├── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Guna02826/chatterbox.git
cd chatterbox
```

### 2️⃣ Start the Backend

```bash
cd backend
npm install
node index.js
```

### 3️⃣ Start the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4️⃣ Open in Browser

Visit: [http://localhost:5173](http://localhost:5173)  
Open multiple tabs to test real-time messaging.

---

## 📸 Screenshots

![Chat UI Screenshot](./screenshot.png "Chatterbox Screenshot")

---

## 🌐 Deployment

### Backend (Render)

- Deploy the `backend` folder on [Render](https://render.com)
- Ensure WebSocket and CORS are enabled

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
```

- Deploy the `dist/` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## 🛠 Future Enhancements

- 💾 MongoDB integration for persistent chat history
- 🔐 User authentication (login/register)
- ✍️ Typing indicators
- ✅ Read receipts
- 👥 Group chats & DMs

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Support & Feedback

- Found a bug? [Open an issue](https://github.com/Guna02826/chatterbox/issues)
- Like the project? [Give it a star ⭐ on GitHub](https://github.com/Guna02826/chatterbox)
