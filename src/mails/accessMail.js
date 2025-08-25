const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const userModel = require('../models/userModel');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})

const fileAccessMail = async (filename, accessedBy, recipient, timeStamp, ipAddress, location) => {
    try{
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: recipient,
            subject: "File access mail",
            text: `The file ${filename} has been accessed by ${accessedBy} from IP address: ${ipAddress} from ${location} at ${timeStamp}`
        })
        console.log('Access mail sent');
    }
    catch(error){
        console.log('Error in sending access mail' + error.message);
    }
}

module.exports = fileAccessMail;