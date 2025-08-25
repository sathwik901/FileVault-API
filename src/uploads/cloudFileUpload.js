const express = require('express');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const router = express.Router();
const humanInterval = require('human-interval');
const fs = require('fs');

const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');
const verifyAuth = require('../authentication/middleware/authMiddleware');  
const agenda = require('../deletion/autoDelete');
const scanFile = require('../virus/virusScanner');
const fileUploadMail = require('../mails/uploadMail');

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION
})

const storage = multer.diskStorage({
    destination: 'fileUploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage});

router.post('/cloud', verifyAuth, upload.single('myfile'), async (req, res) => {
    if(!req.file){
        return res.status(400).send('No file uploaded');
    }
    try{
        const filePath = req.file.path;
        const isInfected = await scanFile(filePath);

        if(isInfected){
            fs.unlinkSync(filePath);
            return res.status(400).send('File is corrupted and not uploaded');
        }

        const fileStream = fs.createReadStream(filePath);

        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: req.file.filename,
            Body: fileStream,
            ContentType: req.file.mimetype
        }));

        fs.unlinkSync(filePath);

        const user = await userModel.findById(req.user.id);

        const fileData = {
            fileName: req.file.originalname,
            key: req.file.filename,
            owner: req.user.id,
            sharedWith: [],
            storageType: 'cloud',
        };

        if(req.body.expiryTime){
            fileData.expiryTime = new Date(Date.now() + humanInterval(req.body.expiryTime));
        }

        const file = await fileModel.create(fileData);

        if(req.body.expiryTime){
            await agenda.schedule(
                fileData.expiryTime,
                "deleteFile",
                {
                    fileId: file._id,
                    s3Key: file.key
                }
            )
        }

        fileUploadMail(file.fileName, user.email);
        res.status(200).send('File uploaded successfully'); 
    }
    catch(error){
        res.status(500).send('Server error: ' + error.message);
    }    
})

module.exports = router;
