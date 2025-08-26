const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const dotenv = require('dotenv');

const authRoute = require('./src/authentication/routes/authRoutes');
const localFileUploadRoute = require('./src/uploads/localFileUpload');
const cloudFileUploadRoute = require('./src/uploads/cloudFileUpload');
const userSharing = require('./src/sharing/userSharing');
const sharedFiles = require('./src/files/sharedFiles');
const receivedFiles = require('./src/files/receivedFiles');
const downloadFile = require('./src/downloads/download')
const linkSharing = require('./src/sharing/linkSharing');
const localFileDelete = require('./src/deletion/localFileDelete');
const cloudFileDelete = require('./src/deletion/cloudFileDelete');
const agenda = require('./src/deletion/autoDelete');
const uploadedFiles = require('./src/files/uploadedFiles');

dotenv.config();

const app = express();

const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl)

app.use(express.json()); 

app.use(cookieParser());

app.set('trust proxy', true);

app.get("/", (req, res) => {
  res.json({
    message: "📁 FileVault API is running!",
    docs: "https://github.com/sathwik901/FileVault-API",
    author: "Sathwik Reddy"
  });
});

app.use('/auth', authRoute)

app.use('/upload', localFileUploadRoute);

app.use('/upload', cloudFileUploadRoute);

app.use('/view', express.static('fileUploads'));

app.use('/share', userSharing);

app.use('/shared', sharedFiles);

app.use('/received', receivedFiles);

app.use('/download', downloadFile);

app.use('/share-link', linkSharing);

app.use('/delete', localFileDelete);

app.use('/delete', cloudFileDelete);

app.use('/files-uploaded', uploadedFiles);

agenda.start();

app.listen(3000, () => {
    console.log('running on port 3000');
});
