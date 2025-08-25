File Upload and Email Notification System
📌 Project Overview

This project is a Node.js + Express application that allows users to:

Upload files (stored locally or on AWS S3).

Get notified via email (Gmail SMTP) once their file is successfully uploaded.

Retrieve and view all files they have uploaded.

It’s designed as a starter boilerplate for building file-sharing or cloud-storage style apps.

✨ Features

File upload using Multer middleware.

Email notifications using Nodemailer (Gmail SMTP).

Secure environment variables using .env.

Option to store files either:

Locally on the server

On AWS S3 bucket

API endpoint to fetch all uploaded files for a user.

Safe handling of secrets (via .gitignore).

🛠️ Tech Stack

Backend: Node.js, Express

File Upload: Multer / Multer-S3

Cloud Storage: AWS S3 (optional)

Email Service: Nodemailer (Gmail SMTP)

Database: MongoDB (for storing file metadata)


📬 API Endpoints
Upload a File

POST /upload

Uploads a file and sends email notification.

Get All Files Uploaded by a User

GET /files/:userId

Returns list of files uploaded by the given user.

⚠️ Security Notes

Use a Gmail App Password (not your real Gmail password).

Always add .env and node_modules/ to .gitignore.

📌 Future Enhancements

Add JWT authentication for secure file access.

Enable file download links with signed URLs.

Add file size & type restrictions.

Build a frontend with React.# Secure-File-Sharing-Application
# Secure-file-sharing
