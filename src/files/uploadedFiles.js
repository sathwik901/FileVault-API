const express = require('express');
const router = express.Router();
const fileModel = require('../models/fileModel');
const verifyAuth = require('../authentication/middleware/authMiddleware');

router.get('/', verifyAuth, async (req, res) => {
    try{
        const files = await fileModel.find({owner: req.user.id});
        res.status(200).json({
            message: "Files uploaded by you",
            files
        });
    }catch(error){
        res.status(500).json({error: "Server error while fetching files"});
    }
})

module.exports = router;