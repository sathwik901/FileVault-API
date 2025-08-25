const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})

const fileUploadMail = async (filename, recipient) => {
    try{
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: recipient,
            subject: "File upload mail",
            text: `The file ${filename} has been uploaded to the system`
        })
        console.log('Upload mail sent');
    }
    catch(error){
        console.log('Error in sending upload mail' + error.message);
    }
}

module.exports = fileUploadMail;