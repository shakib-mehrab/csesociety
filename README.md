# CoU CSE Society Management System

This is a full-stack web application to manage the "CSE Society" activities for Comilla University's Computer Science and Engineering Department.

## Prerequisites

- Node.js (LTS version)
- npm or Yarn
- MongoDB (running instance, local or cloud like MongoDB Atlas)
- Cloudinary Account (for image storage)
- VS Code (recommended IDE)
- GitHub Copilot Extension (for development assistance)

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd cou-cse-society
```

### Backend Setup

```bash
cd server
npm install
```

#### Create `.env` file
Copy `server/.env.example` to `server/.env` and fill in your actual values for `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

#### Run Backend
```bash
npm start
```
The server should run on `http://localhost:5000`

### Frontend Setup
```bash
cd ../client
npm install
```

#### Create `.env` file
If you need to specify the API URL, create a `.env` file in the `client` directory.
`VITE_API_URL=http://localhost:5000/api`

#### Run Frontend
```bash
npm run dev
```
The React app should open in your browser, typically `http://localhost:5173`

## Initial Super Admin Account

**Important:** For the first run, you will need a Super Admin account. Since there's no initial Super Admin creation UI, you can manually create one directly in your MongoDB database using a tool like MongoDB Compass or a simple Node.js script.

### Steps to manually create a Super Admin (example using MongoDB Compass):

1.  Connect to your `csesociety` database.
2.  Go to the `users` collection.
3.  Insert a new document with `name`, `email`, `studentId`, `department`, `role: "super_admin"`, and a **hashed password**. You can use `bcryptjs` in a Node.js console to hash a password:
    
    ```javascript
    const bcrypt = require('bcryptjs');
    const password = 'your_super_admin_password';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword); // Use this hash in MongoDB
    ```
    
4.  Once the Super Admin account is created, you can log in using its email and the original password.
