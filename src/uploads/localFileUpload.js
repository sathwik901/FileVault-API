const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fs = require("fs");

const fileModel = require('../models/fileModel');
const scanFile = require('../virus/virusScanner');
const fileUploadMail = require('../mails/uploadMail');
const verifyAuth = require('../authentication/middleware/authMiddleware');
const userModel = require('../models/userModel');

const storage = multer.diskStorage({
    destination: 'fileUploads',
    filename: function(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000}
})

router.post('/local', verifyAuth, upload.single('myfile'), async (req, res) => {

    try{
        if(!req.file){
            res.status(400).send('No file uploaded');
        }

        const isInfected = await scanFile(req.file.path);

        if (isInfected) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'File is infected and was not saved' });
        }

        const owner = await userModel.findById(req.user.id);

        await fileModel.create({
            fileName: req.file.originalname,
            key: req.file.filename,
            owner: req.user.id,
            sharedWith: [],
            storageType: 'local'
        });

        await fileUploadMail(req.file.originalname, owner.email);

        res.status(200).send('file uploaded successfully');
    }
    catch(error){
        console.error("Upload error:", error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
    
    
})

module.exports = router;