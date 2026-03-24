# Shramik Voice 🗣️

> A full-stack grievance management platform built for factory workers and trade unions.

Workers can register, lodge complaints, and track their resolution status in real time. Admins have a dedicated dashboard to manage grievances, update statuses, and oversee all registered users.

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcrypt |
| HTTP Client | Axios |
| Notifications | react-hot-toast |

---

## ✨ Features

### Worker
- Register and login securely
- Lodge grievances with title, category, and description
- Track grievance status in real time (Pending → In Review → Resolved → Rejected)
- Personal dashboard showing total, pending, and resolved grievances

### Admin
- Dedicated admin dashboard with full platform overview
- View all grievances and all registered users
- Update grievance status directly from the dashboard
- Stats: total users, total grievances, pending, and resolved counts
- Recent grievances overview (last 5)

---

## 📁 Project Structure

```
shramik-voice/
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── LodgeGrievance.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios instance + all API calls
│   │   └── App.jsx
│   └── .env
│
└── backend/                   # Express backend
    ├── controllers/
    │   ├── authController.js
    │   ├── grievanceController.js
    │   └── adminController.js
    ├── models/
    │   ├── User.js
    │   └── Grievance.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── grievanceRoutes.js
    │   └── adminRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    └── index.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/ys09123/shramik-voice.git
cd shramik-voice
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI= # paste your MongoDB connection string here
JWT_SECRET= # generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the server:

```bash
node index.js
```

### 3. Setup the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the React app:

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |

### Grievances
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/grievances` | Lodge a new grievance | Protected |
| GET | `/api/grievances/mine` | Get logged-in user's grievances | Protected |

### Admin
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/stats` | Get platform stats | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/grievances` | Get all grievances | Admin |
| PATCH | `/api/admin/grievances/:id/status` | Update grievance status | Admin |

---

## 🔐 Authentication

- On login, a JWT token is issued and stored in `localStorage`
- All protected routes attach the token via `Authorization: Bearer <token>` header
- The `protect` middleware verifies the token on every protected request
- On 401 response, the axios interceptor automatically clears storage and redirects to `/login`
- Admin routes are additionally protected by role check (`user.role === "admin"`)

---

## 🎨 Design

Shramik Voice uses a **neobrutalist** design system — bold borders, amber accents, thick shadows, and uppercase typography — built entirely with Tailwind CSS utility classes.

---

## 📄 License

MIT License. Feel free to use and modify.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

Built with ✊ for workers. Powered by unity.
