# Community Cleanliness & Public Issue Reporting System

A full-stack web application that empowers communities to report damaged public property, view existing issues, and contribute through donations.

---

## Project Holder

| | |
|---|---|
| **Name** | Vivekanand Tripathi |
| **Email** | vivektripathi3405@gmail.com |
| **Mobile** | +91 7879539174 |
| **WhatsApp** | [Chat on WhatsApp](https://wa.me/917879539174) |

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, JWT
- **Database:** MongoDB (Atlas for production)

---

## Do you need to connect MongoDB separately?

**Yes — you must provide a MongoDB connection string.** The app does not include a hosted database.

| Environment | What to use |
|-------------|-------------|
| **Local dev** | Local MongoDB (`mongodb://127.0.0.1:27017/...`) **or** MongoDB Atlas |
| **Render / production** | **MongoDB Atlas** (free tier works) |

### Set up MongoDB Atlas (recommended for deploy)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free cluster**.
3. **Database Access** → add a database user (username + password).
4. **Network Access** → add `0.0.0.0/0` (allow from anywhere — needed for Render).
5. **Connect** → choose **Drivers** → copy the connection string.
6. Replace `<password>` with your user password and set the database name, e.g.:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/community-cleanliness?retryWrites=true&w=majority
   ```
7. Put that string in `server/.env` locally, and in **Render environment variables** when deploying.

---

## Run locally

### Backend

```bash
cd server
npm install
cp .env.example .env   # then edit MONGODB_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Open **http://localhost:5173**

---

## Deploy to Render

This project uses **two Web Services** on Render:

| Service | Stack | Root directory |
|---------|--------|----------------|
| **community-cleanliness-api** | Node.js, Express, MongoDB, JWT | `server` |
| **community-cleanliness-web** | React, Vite, Tailwind CSS | *(repo root)* |

### Option A — Blueprint (recommended)

1. [render.com](https://render.com) → **New** → **Blueprint**
2. Connect **Swapnil1298/Community-Cleanliness-Issues**
3. When prompted, set **`MONGODB_URI`** (Atlas connection string)
4. Deploy both services from `render.yaml`

### Option B — Manual setup

#### Backend Web Service

| Setting | Value |
|---------|--------|
| Name | `community-cleanliness-api` |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

**Environment variables:**

| Key | Value |
|-----|--------|
| `MONGODB_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Long random secret |
| `FRONTEND_URL` | `https://community-cleanliness-web.onrender.com` |
| `NODE_ENV` | `production` |

**Health check:** `https://community-cleanliness-api.onrender.com/api/health` → `{"status":"ok"}`

#### Frontend Web Service

| Setting | Value |
|---------|--------|
| Name | `community-cleanliness-web` |
| Root Directory | *(leave empty)* |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

**Environment variables:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://community-cleanliness-api.onrender.com/api` |

After changing `VITE_API_URL`, run **Clear build cache & deploy** (Vite bakes env vars at build time).

### MongoDB Atlas on Render

Use the **standard** connection string if `mongodb+srv://` fails:

```
mongodb://USER:PASSWORD@ac-bstrrkw-shard-00-00.xxxxx.mongodb.net:27017,.../Community-Cleanliness-Issues?ssl=true&authSource=admin&retryWrites=true&w=majority
```

Atlas → **Network Access** → allow `0.0.0.0/0`.

### Note on profile image uploads

On Render’s free tier, uploaded profile images may be lost when the server restarts. Auth, issues, and contributions in MongoDB Atlas are persistent.

---

## Repository

**GitHub:** [github.com/Swapnil1298/Community-Cleanliness-Issues](https://github.com/Swapnil1298/Community-Cleanliness-Issues)

---

## Publish to GitHub

This project is connected to:

```bash
git remote -v
# origin  https://github.com/Swapnil1298/Community-Cleanliness-Issues.git
```

To push updates:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

---

## Contact

- Email: vivektripathi3405@gmail.com
- Phone: +91 7879539174
- WhatsApp: https://wa.me/917879539174

© Vivekanand Tripathi. All rights reserved.
