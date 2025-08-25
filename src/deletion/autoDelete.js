const Agenda = require('agenda');
const {S3Client, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

const fileDeletedMail = require('../mails/deletionMail');
const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');

dotenv.config();

const agenda = new Agenda({
    db: {
        address: process.env.DB_URL,
        collection: 'jobs'
    }
});

const s3 = new S3Client({
    region: process.env.AWS_REGION
})

agenda.define("deleteFile", async (job) => {
    const {fileId, s3Key} = job.attrs.data;

    const file = await fileModel.findById(fileId);
    const filename = file.fileName;

    const user = await userModel.findById(file.owner);
    const email = user.email;

    try{
        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3Key
            })
        )

        await fileModel.findByIdAndDelete(fileId);

        await fileDeletedMail(filename, email);
    }
    catch(error){
        res.status(500).send('Error deleting file' + error.message);
    }
})

module.exports = agenda;
