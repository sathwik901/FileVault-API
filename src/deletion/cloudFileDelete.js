const express = require('express');
const router = express.Router();
const verifyAuth = require('../authentication/middleware/authMiddleware');
const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');
const {S3Client, DeleteObjectCommand} = require('@aws-sdk/client-s3');

const fileDeletedMail = require('../mails/deletionMail');

const dotenv = require('dotenv');

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

router.delete('/cloud/:fileId', verifyAuth, async (req, res) => {
    try{
        const fileId = req.params.fileId;
        const file = await fileModel.findById(fileId);
        const user = await userModel.findById(req.user.id);

        if(!file){
            return res.status(404).send('File not found');
        }

        if (file.owner.toString() !== req.user.id) {
            return res.status(403).send('Forbidden: You are not the owner of this file.');
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.key
        }) 

        await s3.send(command);

        await fileModel.deleteOne({_id: fileId});

        await fileDeletedMail(file.fileName, user.email);

        res.status(200).send('File deleted successfully');

    }catch(error){
        res.status(500).send('Error deleting file' + error.message);
    }
})

module.exports = router;