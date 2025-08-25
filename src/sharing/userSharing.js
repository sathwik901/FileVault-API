const express = require('express');

const verifyAuth = require('../authentication/middleware/authMiddleware');

const fileModel = require('../models/fileModel');
const userModel = require('../models/userModel');

const router = express.Router();

router.post('/file', verifyAuth, async (req, res) => {
    try{
        const {filename, recipient_username} = req.body;

        if(!filename || !recipient_username){
            return res.status(400).send('Filename and recipient username are required');
        }

        const file = await fileModel.findOne({fileName: filename, owner: req.user.id});

        if(!file){
            return res.status(404).send('File not found');
        }
        
        const recipient = await userModel.findOne({userName: recipient_username});

        if(!recipient){
            return res.status(404).send('Recipient not found');
        }

        if(file.sharedWith.includes(recipient._id)){
            return res.status(400).send('File already shared with this user');
        }

        file.sharedWith.push(recipient._id);
        await file.save();

        recipient.sharedFiles.push(file._id);
        await recipient.save();

        res.status(200).send('File shared successfully');
    }
    catch(error){
        res.status(500).send('Server error: ' + error.message);
    }

})


module.exports = router;