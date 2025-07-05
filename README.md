# Grab Merged App 🚖

This is a merged Node.js + Express web application that combines:
- Week 04 Project (`/week04`)
- Week 06 Project (`/week06`)
- Week 07 Project (`/week07`)

## 🚀 Features

✅ One app deployed to Azure  
✅ Three separate modules/routes  
✅ Connected to MongoDB Atlas (shared)  
✅ Organized project structure

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Azure Web App
- GitHub Actions (CI/CD)


## 💻 Run Locally (Before Deploy)
```bash
git clone https://github.com/your-username/mytaxi_assignment.git
cd mytaxi_assignment
npm install
npm start
```
---
## 🌐 MongoDB Atlas

- All routes use a **shared MongoDB Atlas cluster**
- Connection URI is stored in `.env`: MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.oznkp0f.mongodb.net/grabdb
- Passwords and secrets are managed securely with environment variables.
---

---
✅ GitHub Actions: Azure Deployment
- This app is deployed using GitHub Actions to:
```
https://grab-merged-app-cxbcc8akanagaabp.southeastasia-01.azurewebsites.net
```
- Any push to main triggers .github/workflows/deploy.yml
---

## 🌐 Live Demo
Access the app at:  
🔗 [[(https://grab-merged-app-cxbcc8akanagaabp.southeastasia-01.azurewebsites.net/)](https://grab-merged-app-cxbcc8akanagaabp.southeastasia-01.azurewebsites.net
)]

---
## 🧪 How to Test Using Postman

### Week 04 – Ride Booking System

| Feature                | Method | URL                                                                  | Body (JSON)                      |
|------------------------|--------|-----------------------------------------------------------------------|----------------------------------|
| Register Passenger     | POST   | `/week04/passengers/register`                                        | `{ "name": "...", "email": "...", "password": "..." }` |
| Login Passenger        | POST   | `/week04/auth/passenger`                                             | `{ "email": "...", "password": "..." }` |
| Book Ride              | POST   | `/week04/rides`                                                      | `{ "passengerId": "...", "pickup": "...", "dropoff": "...", "fare": 20 }` |
| Cancel Ride            | DELETE | `/week04/rides/:rideId`                                              | — |
| Rate Driver            | POST   | `/week04/rides/:rideId/rating`                                       | `{ "rating": 4 }` |
| Accept Ride (Driver)   | PATCH  | `/week04/rides/:rideId/accept`                                       | — |
| Complete Ride (Driver) | PATCH  | `/week04/rides/:rideId/complete`                                     | — |

### Admin Panel (Week04)

| Feature          | Method | URL                             |
|------------------|--------|----------------------------------|
| Admin Login      | POST   | `/week04/auth/admin`            |
| View All Users   | GET    | `/week04/admin/users`           |
| View All Rides   | GET    | `/week04/admin/bookings`        |
| Generate Reports | GET    | `/week04/admin/reports`         |

---
---
🔐 Week 06: JWT Auth (Postman Usage)
- POST /week06/users – Register user
- POST /week06/auth/login – Login and receive JWT
- GET /week06/admin/users – Admin-only route
- Add JWT token to Postman Authorization > Bearer Token

### Week 06 – Auth System

| Feature       | Method | URL                    | Body (JSON) |
|---------------|--------|-------------------------|-------------|
| Register User | POST   | `/week06/register`      | `{ "email": "...", "password": "..." }` |
| Login User    | POST   | `/week06/login`         | `{ "email": "...", "password": "..." }` |
| Get Profile   | GET    | `/week06/profile/:id`   | Bearer Token required |

---
---
📊 Week 07: Analytics
- Aggregates total rides & fare per passenger using $lookup, $group, $project.
- Output displayed using Chart.js in the analytics.html dashboard.

### Week 07 – Aggregation & Analytics

| Feature                       | Method | URL                             |
|-------------------------------|--------|----------------------------------|
| Get All Rides                 | GET    | `/week07/rides`                 |
| Get All Passengers            | GET    | `/week07/passengers`            |
| Get Top Drivers by Earnings   | GET    | `/week07/analytics/top-drivers` |
| Get Ride Summary              | GET    | `/week07/analytics/rides`       |

---

---
## ☁️ Deploy to Azure (Steps Summary)
1. Connect your GitHub repo to Azure App Service.
2. Add Application Settings:
    - PORT = 3000
    - MONGODB_URI = your Mongo URI
3. Commit & Push to GitHub.
4. Azure will auto-deploy via GitHub Actions.
---

## 📁 Folder Structure
```bash
grab-merged-app/
├── .env                           # MongoDB Atlas URI, port and secrets
├── .gitignore                     # Ignore node_modules, .env etc.
├── README.md                      # Project overview
├── index.js                       # Main Express app entry point
├── package.json                   # App metadata and dependencies
├── public/
│   └── week07/
│       └── analytics.html         # Week07 Chart.js Dashboard
├── models/
│   ├── index.js
│   ├── Admin.js
│   ├── Booking.js                 # (optional) Ride model (not required if Ride is in index)
│   ├── Driver.js                  # Driver schema for week04
│   ├── Passenger.js               # Passenger schema for week04
│   └── Rating.js                  # Rating schema for week04
├── routes/
│   ├── week04.js                  # E-Hailing APIs (book, login, admin)
│   ├── week06.js                  # JWT Auth + RBAC APIs
│   └── week07.js                  # Aggregation + Analytics
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions for Azure
```

## 🛠️ Troubleshooting Guide
1. "Application Error" on Website
🔍 Reason: Something is broken or missing.
✅ Fix:
    - Make sure .env in Azure has the correct MONGODB_URI and PORT.
    - Inside the index.js, use this:
   ```js
   app.listen(process.env.PORT || 3000, '0.0.0.0');
   ```
2. MongoDB Not Connecting
🔍 Reason: Wrong username/password or missing IP whitelist.
✅ Fix:
    - Use a correct link like:
    ```
    mongodb+srv://admin:admin123@cluster0.oznkp0f.mongodb.net/grabdb
    ```
    - In MongoDB Atlas, whitelist 0.0.0.0/0 in network settings.
  
3. Changes Not Showing on Azure
🔍 Reason: You didn’t push to GitHub or Azure didn't restart.
✅ Fix:
    - Run these in your terminal:
    ```
    git add .
    git commit -m "Updated"
    git push origin main
    ```
    - Then go to Azure → Restart your app.
  
4. Postman Request Fails (404 or Error)
🔍 Reason: Wrong URL or route not found.
✅ Fix:
    - Use full URL like:
    ```
    https://grab-merged-app-cxbcc8akanagaabp.southeastasia-01.azurewebsites.net/week04/passengers/register
    ```
    - Make sure to use ```Body > raw > JSON``` in Postman with correct data.
  
5. App Not Starting (Port Error)
🔍 Reason: Azure uses dynamic port.
✅ Fix:
    - In ```index.js```, make sure you listen on ```process.env.PORT.```
6. Something Deleted or Wrong File
🔍 Reason: Accidentally moved or deleted files.
✅ Fix:
    - Restore files like models/index.js and check all files are committed.
    Example:
    ```
    const Admin = require('./Admin');
    module.exports = { Passenger, Driver, Ride, Rating, Admin };
    ```

## License
This project is licensed for educational purposes only.
