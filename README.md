📁 FileVault API

    A secure file sharing and storage API built with Node.js, Express, MongoDB, and AWS S3.
    Supports secure uploads, virus scanning, sharing, access logging, email notifications, and auto-deletion.

    This project provides a complete solution for user authentication, file management, secure sharing with expiring links, virus scanning, 
    and a full audit trail.


🚀 Features

    🔐 User Authentication – Secure user registration and login using JSON Web Tokens (JWT).
    
    📤 File Uploads – Upload files locally or to AWS S3. Seamlessly uploads files directly to AWS S3 for scalable, durable, and secure             storage.
    
    🛡 Virus Scanning – Scan files before saving using ClamAV integration. Asynchronously scans every uploaded file for malware using              ClamAV and a background job queue, quarantining infected files.
    
    📩 Email Notifications – Send upload, access, and deletion alerts via Nodemailer. Automatically sends email notifications to the file          owner upon access, upload, and deletion.
    
    🔗 File Sharing – Share files via user-to-user or secure public links. Generate unique shareable links for any file. Set custom                expiration times (e.g., "in 5 days and 3 hours"). Enforce a maximum number of downloads.
    
    📥 File Downloads – Secure, logged downloads with access validation. Authenticated users can access their files directly. Public               sharing is handled via temporary, secure S3 Pre-signed URLs.
    
    ⏳ Auto Deletion – Time-based file expiry and scheduled clean-up. Schedule files for automatic deletion at a specific future time using        a persistent job scheduler.
    
    📜 Access Logs – Maintain history of file access events. Logs every file access, tracking who, what, when, and from where (IP and              Geolocation).


🛠 Tech Stack

    Backend: Node.js, Express.js
    
    Database: MongoDB (Mongoose ORM)

    Authentication: JSON Web Token (JWT), bcrypt.js
    
    Storage: Local FS, AWS S3

    File Handling: Multer

    Virus Scanning: ClamAV
    
    Email: Nodemailer (SMTP - Gmail/Custom)
    
    Job Queues: Agenda.js / BullMQ with Redis (for auto-deletion and asynchronous tasks)

    Geolocation: IP-API.com


📌 API Endpoints

    Authentication:
    
        POST /auth/register → Register new user
        POST /auth/login → Login and get JWT
        POST /auth/logout → Logout and delete the JWT
    
    File Uploads:
    
        POST /upload/local → Upload file to local server
        POST /upload/cloud → Upload file to AWS S3
    
    File Downloads:
    
        GET /download/file/:id → Download file securely
    
    File Sharing:
    
        POST /share/file → Share file with another user
        POST /share-link/:fileId → Generate a secure shareable link
    
    File Deletion:
    
        Local file deletion
        DELETE /delete/local/:fileId → Delete local uploaded files
        
        Cloud File deletion
        DELETE /delete/cloud/:fileId → Delete cloud uploaded files
    
    File Management:
    
        Files shared:
        GET /shared/files → Get the files shared by the user
        
        Files received:
        GET /received/files → Get the files received by the user
        
        Files uploaded:
        GET /files-uploaded/ → Get the files uploaded by the user
        

📄 Example cURL (Signup)

    curl -X POST https://your-app.onrender.com/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"John","email":"john@example.com","password":"mypassword"}'


✅ Future Improvements

    Add two-factor authentication for critical operations.
    
    Enable file previews for common types (PDF, images).
    
    Implement rate limiting & IP-based access controls.
    
    Build a React frontend for user-friendly interaction.

👨‍💻 Author

    Sathwik Reddy
    💼 Backend Developer | MERN Stack | Security Enthusiast
