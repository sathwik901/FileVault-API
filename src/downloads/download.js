const express = require('express');
const axios = require('axios');

const verifyAuth = require('../authentication/middleware/authMiddleware');
const fileModel = require('../models/fileModel');
const shareLinkModel = require('../models/shareLinkModel');
const fileAccessLogModel = require('../models/fileAccessLogsModel');
const fileAccessMail = require('../mails/accessMail');

const router = express.Router();
const path = require('path');
const {S3Client, GetObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
const userModel = require('../models/userModel');

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

const getIpDetails = async (ip) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        if (response.data.status === "success") {
            return {
                country: response.data.country,
                region: response.data.regionName,
                city: response.data.city,
                isp: response.data.isp
            };
        }
    } catch (error) {
        console.error("IP-API error:", error.message);
    }
    return {};
}


router.get('/file/:id', verifyAuth, async (req, res) => {

    try{

        const fileId = req.params.id;

        const file = await fileModel.findById(fileId);

        const owner = await userModel.findById(file.owner);

        if(!file){
            return res.status(404).send('file not found');
        }

        if(file.owner.toString() !== req.user.id && !file.sharedWith.includes(req.user.id)){
            return res.status(403).send('Access denied');
        }

        const ip = req.ip;
        const ipDetails = await getIpDetails(ip);

        if(file.storageType === 'local'){
            const filePath = path.join(__dirname, '../../fileUploads', file.key);
            return res.download(filePath, file.fileName, async(err) => {
                if(err){
                    console.log('Download failed', err);
                    return;
                }

                try{
                    const accessDetails = await fileAccessLogModel.create({
                        file: file._id,
                        accessedBy: req.user.id,
                        timeStamp: new Date(),
                        ipAddress: ip,
                        location: `${ipDetails.city}, ${ipDetails.region}, ${ipDetails.country}`
                    });

                    await fileAccessMail(file.fileName, req.user.userName, owner.email, accessDetails.timeStamp, accessDetails.ipAddress, accessDetails.location);
                }
                catch(err){
                    console.log('Error sending mail', err);
                }

            });
        }

        if(file.storageType === 'cloud'){
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: file.key
            })

            const url = await getSignedUrl(s3, command, {expiresIn: 60 * 5});

            const accessDetails = await fileAccessLogModel.create({
                file: file._id,
                accessedBy: req.user.id,
                timeStamp: new Date(),
                ipAddress: ip,
                location: `${ipDetails.city}, ${ipDetails.region}, ${ipDetails.country}`
            });

            await fileAccessMail(file.fileName, req.user.userName, owner.email, accessDetails.timeStamp, accessDetails.ipAddress, accessDetails.location);


            return res.status(200).json({
                downloadUrl: url
            })

        }

        res.status(400).send('Unknown storage type');
    }
    catch(error){
        res.status(500).send('error:' + error.message);
    }
})

router.get('/:token', async (req, res) => {

    const ip = req.ip;
    const ipDetails = await getIpDetails(ip);

    try {
        const token = req.params.token;
        
        const link = await shareLinkModel.findOne({ token })
            .populate({
                path: 'fileId',
                populate: { path: 'owner', model: 'UserModel' } 
            });

        if (!link) {
            return res.status(404).send('Link not found or invalid');
        }

        if (link.expiresAt && Date.now() > link.expiresAt) {
            return res.status(410).send('Link has expired');
        }
        if (link.maxDownloads !== null && link.downloadsSoFar >= link.maxDownloads) {
            return res.status(429).send('Download limit has been reached');
        }
    
        const file = link.fileId;
        const owner = file.owner;

        link.downloadsSoFar += 1;
        await link.save();

        try {
            const accessDetails = await fileAccessLogModel.create({
                file: file._id,
                accessedBy: req.user.id,
                timeStamp: new Date(),
                ipAddress: ip,
                location: `${ipDetails.city}, ${ipDetails.region}, ${ipDetails.country}`
            });
            await fileAccessMail(file.fileName, 'An anonymous user', owner.email, accessDetails.timeStamp, accessDetails.ipAddress, accessDetails.location);
        } catch (logError) {
            console.error('Error during logging/notification:', logError);
        }

        if (file.storageType === 'local') {
            const filePath = path.join(__dirname, '../../fileUploads', file.key);
            return res.download(filePath, file.fileName);
        }

        if (file.storageType === 'cloud') {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: file.key
            });
            const url = await getSignedUrl(s3, command, { expiresIn: 300 }); 
            return res.redirect(url);
        }
    } catch (error) {
        console.error('Public download error:', error);
        res.status(500).send('Server error.');
    }
});

module.exports = router;
