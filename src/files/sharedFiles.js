const express = require('express');
const router = express.Router();
const verifyAuth = require('../authentication/middleware/authMiddleware');
const fileModel = require('../models/fileModel');

router.get('/files', verifyAuth, async (req, res) => {
    const filesSharedByMe = await fileModel.find({owner: req.user.id, sharedWith: {$exists: true, $not: {$size: 0}}});
    res.status(200).json({message: 'Files shared by me', files: filesSharedByMe});
})

module.exports = router;