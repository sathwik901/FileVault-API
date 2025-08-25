const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: process.env.GMAIL_USER,
        pass: process.env._GMAIL_PASS
    }
});

const fileDeletedMail = async (fileName, recipient) => {
    try{
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: recipient,
            subject: "File deletion mail",
            text: `The file ${fileName} has been deleted from the system`
        })
        console.log('Deletion mail sent');
    }
    catch(error){
        console.log('Error in sending deletion mail' + error.message);
    } 
}

module.exports = fileDeletedMail;