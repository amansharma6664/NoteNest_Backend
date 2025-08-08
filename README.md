# 📘 NoteNest Backend

This is the backend server for **NoteNest**, a secure and user-friendly notebook app built with the **MERN (MongoDB, Express.js, React.js, Node.js)** stack. The backend handles user authentication using JWT and provides RESTful APIs for managing user notes.

---

## 🚀 Features

- 🔐 User authentication (JWT-based)
- 📚 CRUD operations for notes (Create, Read, Update, Delete)
- 🧾 Input validation and error handling
- 🌐 Cross-Origin Resource Sharing (CORS) enabled for frontend connection
- 🛡️ Secure password hashing with bcrypt

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Token)**
- **bcryptjs**
- **dotenv**
- **cors**

---

## 📁 Folder Structure

backend/
│
├── config/ # MongoDB connection setup
├── middleware/ # JWT authentication middleware
├── models/ # Mongoose models (User, Note)
├── routes/ # Express routes (auth, notes)
├── .env # Environment variables
├── index.js # Entry point of the server
├── package.json


---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/notenest-backend.git
cd notenest-backend

2. Install Dependencies
npm install

3. Create a .env File
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

4. Run the Server
npm start

The server will run at http://localhost:5000

🧪 API Endpoints
Auth Routes (/api/auth)
POST /createuser – Register a new user

POST /login – Log in user

POST /getuser – Get logged-in user details (requires token)

Notes Routes (/api/notes)
GET /fetchallnotes – Get all notes of logged-in user

POST /addnote – Add a new note

PUT /updatenote/:id – Update a note by ID

DELETE /deletenote/:id – Delete a note by ID

🌍 Live Deployment
The backend server is live and accessible at:
🔗 https://notenest-backend-mgaj.onrender.com

You can directly connect your frontend to this API endpoint.

🔗 Frontend
Check out the frontend repo here: https://github.com/amansharma6664/NoteNest_Frontend