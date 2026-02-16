# 🚖 Ride Express — Backend

A modular, scalable, and production-ready backend for a ride-hailing platform built with **TypeScript**, **Express.js**, and **MongoDB**. It supports secure authentication, role-based access control, and a complete ride request & fulfillment workflow with real-time status updates.

---

## 🌍 Live API

**Base URL**

```
demo : 
```

---

## 🛠 Tech Stack

### Core Framework & Language

* **Node.js** — Runtime environment
* **Express.js (v5)** — REST API framework
* **TypeScript** — Static typing for maintainability

### Database & ORM

* **MongoDB** — Flexible NoSQL database
* **Mongoose** — MongoDB object modeling

### Authentication & Security

* **JWT (jsonwebtoken)** — Token-based authentication
* **bcryptjs** — Password hashing
* **Passport.js** — Authentication middleware
* **Passport Local & Google OAuth** — Multiple login strategies

### Validation & Utilities

* **Zod** — Schema validation
* **Day.js** — Date/time handling
* **http-status-codes** — Clean HTTP responses
* **Axios** — HTTP client

### Development & Tooling

* **ts-node-dev** — Hot reload for TypeScript
* **ESLint** — Code linting
* **dotenv** — Environment config

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access (Admin / Rider / Driver)

### 👤 User & Driver Management

* Rider and driver profiles
* Driver applications & approval workflow

### 🚕 Ride Lifecycle Workflow

```
REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED
          ↘ REJECTED
          ↘ CANCELLED
```

* Status validation
* Real-time updates
* Earnings tracking

### 🛡 Reliability

* MongoDB transactions
* Centralized error handling
* Schema validation with Zod

---

## 📂 Project Structure

```
src/
├── app/
│   ├── config/
│   ├── errorHelpers/
│   ├── helpers/
│   ├── interface/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── driver/
│   │   ├── ride/
│   │   └── user/
│   ├── routes/
│   ├── utils/
│   └── constants/
├── app.ts
└── server.ts
```

---

## 🚀 Platform Features

### 🛵 Rider Features

* Registration & login (credentials / Google OAuth)
* Profile management
* Ride request with coordinates
* Ride history
* Cancel rides
* Secure password management

### 🚗 Driver Features

* Apply to become driver
* Availability toggle
* Accept & complete rides
* Earnings tracking

### 🛠 Admin Features

* User management
* Driver application approval
* Ride monitoring
* Role-based permissions

---

## 📡 API Endpoints Overview

### 1️⃣ User Management

**Register User**

```
POST /api/v1/user/register
```

**Get All Users**

```
GET /api/v1/user/all-users
Access: ADMIN, SUPER_ADMIN
```

**Get Profile**

```
GET /api/v1/user/me
```

**Update User**

```
PATCH /api/v1/user/:id
```

---

### 2️⃣ Authentication

**Login**

```
POST /api/v1/auth/login
```

**Refresh Token**

```
POST /api/v1/auth/refresh-token
```

**Logout**

```
POST /api/v1/auth/logout
```

**Password Management**

```
POST /api/v1/auth/set-password
POST /api/v1/auth/reset-password
```

---

### 3️⃣ Driver Management

**Apply Driver**

```
POST /api/v1/driver/apply-driver
```

**Update Availability**

```
PATCH /api/v1/driver/update-availability
```

---

### 4️⃣ Ride Management

**Request Ride**

```
POST /api/v1/ride
```

**Update Ride Status**

```
PATCH /api/v1/ride/rideStatus/:rideId
```

**Cancel Ride**

```
PATCH /api/v1/ride/cancel/:rideId
```

**Ride History**

```
GET /api/v1/ride/rideHistory
```

**Earnings**

```
GET /api/v1/ride/earnings
```

---

## 📌 Validation Rules

* Coordinates must be `[latitude, longitude]`
* Driver vehicle type must match ride request
* Driver must be available before accepting rides

---

## ⚙️ Setup & Environment

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Subahan-1D/ride-booking-backend.git
cd ride-express-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env` file:

```
PORT=8000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/demo-db
NODE_ENV=development
#JWT 
# JWT Access Token
JWT_ACCESS_SECRET=demo_access_secret
JWT_ACCESS_EXPIRED=5d

# JWT Refresh Token
JWT_REFRESH_SECRET=demo_refresh_secret
JWT_REFRESH_EXPIRES=30d

# Bcrypt Salt Round
BCRYPT_SALT_ROUND=10

# Super Admin Credentials
SUPER_ADMIN_EMAIL=demo@gmail.com
SUPER_ADMIN_PASSWORD=01786727749

# Google OAuth
GOOGLE_CLIENT_SECRET=your-google-client-id
GOOGLE_CLIENT_ID=your-google-client-password
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback
#Express Session
EXPRESS_SESSION_SECRET=your-google-session-secret

# Frontend URL
FRONT_END_URL=http://localhost:5173
```

---

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## 👨‍💻 Author

**Your Name**
GitHub | LinkedIn

---

## 🙌 Acknowledgements

* MongoDB
* Express.js
* TypeScript
* Node.js
* Zod
* Open Source Community

---

## 📧 Contact

Email: **[subahanislam523@gmail.com](mailto:subahanislam523@gmail.com)**
GitHub Issues: Open an issue for questions or feedback

---

### ⭐ If you like this project, consider giving it a star!
