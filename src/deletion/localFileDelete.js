const express = require('express');
const router = express.Router();
const verifyAuth = require('../authentication/middleware/authMiddleware');
const fileModel = require('../models/fileModel');
const fs = require('fs');
const path = require('path');

router.delete('/local/:fileId', verifyAuth, async (req, res) => {
    try{
        const file = await fileModel.findById(req.params.fileId);
        if(!file){
            return res.status(400).send('File with the provided ID does not exist');
        }

        const filePath = path.join(__dirname, '../../fileUploads', file.key);

        console.log(filePath);

        if(file && fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }

        await fileModel.findByIdAndDelete(req.params.fileId);

        res.status(200).send(`File with id: ${req.params.fileId} deleted successfully`);
    }catch(error){
        console.log(error);
        res.status(500).send('Error in deleting file');
    }
})

module.exports = router;