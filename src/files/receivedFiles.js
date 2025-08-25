const express = require('express');
const router = express.Router();
const verifyAuth = require('../authentication/middleware/authMiddleware');
const fileModel = require('../models/fileModel');

router.get('/files', verifyAuth, async (req, res) => {
    const filesReceivedByMe = await fileModel.find({sharedWith: req.user.id});
    res.status(200).json({message: 'Files received by me', files: filesReceivedByMe});
}) 

module.exports = router;