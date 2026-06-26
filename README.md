# SurakshaDigi Dashboard — Frontend

> Family Caregiver Dashboard for the SurakshaDigi Platform

A React-based web dashboard that allows family members to monitor elderly relatives, view AI-generated safety alerts, and manage elder registrations in real time.

---

## 🏗️ Architecture

```
React Frontend (port 5173)
        ↓  Axios (JWT interceptor)
Express Backend (port 5000)
        ↓              ↓
MongoDB Atlas    Gemini 2.5 Flash
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Routing | React Router v6 |
| State Management | Context API |
| HTTP Client | Axios (with interceptors) |
| Styling | CSS (cream/amber/teal brand) |

---

## 📁 Project Structure

```
suraksha-digi-dashboard/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state (JWT + family info)
│   ├── pages/
│   │   ├── Login.jsx           # Family member login
│   │   ├── Dashboard.jsx       # View + resolve elder alerts
│   │   └── AddElder.jsx        # Register a new elder
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                # Entry point
├── index.html
└── vite.config.js
```

---

## ✨ Features

- **Login** — JWT-based authentication for family members
- **Dashboard** — Fetch and view AI-generated fraud alerts for any elder
- **Alert Cards** — Show alert type, severity, English analysis, Hindi guidance, and resolution status
- **Resolve Alerts** — Mark alerts as resolved directly from the dashboard
- **Add Elder** — Register new elders linked to the family account
- **Auto Auth** — Axios interceptor automatically attaches JWT to every API request
- **Protected Routes** — Redirects to login if not authenticated

---

## 🔐 React Patterns Used

### Context API
```jsx
// AuthContext provides login(), logout(), token, and family info
// globally across all components without prop drilling
```

### Axios Interceptors
```jsx
// Automatically attaches Bearer token to every outgoing request
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- SurakshaDigi backend running on port 5000

### Setup

```bash
# Clone the repo
git clone https://github.com/tiwariaayush004-ui/suraksha-digi-dashboard.git
cd suraksha-digi-dashboard

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

> Make sure the backend (suraksha-digi) is running on port 5000 simultaneously.

---

## 🖥️ Pages Overview

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Family member authentication |
| Dashboard | `/dashboard` | View + resolve elder alerts |
| Add Elder | `/add-elder` | Register a new elder |

---

## 🔗 Related Repository

- **Backend API:** [suraksha-digi](https://github.com/tiwariaayush004-ui/suraksha-digi)

---

## 👤 Author

**Aayush Tiwari**  
B.E. Computer Science, Cambridge Institute of Technology — VTU  
GitHub: [@tiwariaayush004-ui](https://github.com/tiwariaayush004-ui)
