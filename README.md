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

The repo includes a `render.yaml` blueprint for two services:

1. **community-cleanliness-api** — Node backend (`server/`)
2. **community-cleanliness-web** — Static React site (`dist/`)

### Steps

1. Push this project to **your GitHub** repository.
2. Go to [render.com](https://render.com) → **New** → **Blueprint** → connect your repo.
3. Set these environment variables when prompted:

**Backend (`community-cleanliness-api`):**

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random secret string |
| `GOOGLE_CLIENT_ID` | Optional |

**Frontend (`community-cleanliness-web`):**

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://community-cleanliness-api.onrender.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Optional |

Replace the API hostname with your actual Render backend URL after the API service is created.

4. Deploy. Use the **web** service URL as your public site.

### Note on profile image uploads

On Render’s free tier, uploaded files are stored on **temporary disk** and may be **lost when the server restarts**. For production, consider Cloudinary or S3 later. Issues and auth still work with Atlas.

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
