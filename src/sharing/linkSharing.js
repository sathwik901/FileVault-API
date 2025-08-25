const express = require('express');
const router = express.Router();
const shareLinkModel = require('../models/shareLinkModel');
const verifyAuth = require('../authentication/middleware/authMiddleware');
const fileModel = require('../models/fileModel');
const crypto = require('crypto');

router.post('/:fileId', verifyAuth, async (req, res) => {
    const fileId = req.params.fileId;
    const file = await fileModel.findById(fileId);
    const {maxDownloads, expiresInSeconds} = req.body;

    if(!file){
        res.status(404).send('File not found');
    }

    if (file.owner.toString() !== req.user.id) {
        return res.status(403).send('Forbidden: You do not own this file.');
    }

    const token = crypto.randomBytes(32).toString('hex');

    let expiresAt = null;
    if(expiresInSeconds && Number(expiresInSeconds) > 0){
        expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    }

    await shareLinkModel.create({
        fileId,
        token,
        createdBy: req.user.id,
        maxDownloads: maxDownloads ?? null,
        downloadsSoFar: 0,
        expiresAt
    })

    const shareLink = `http://localhost:3000/download/${token}`;

    res.status(200).json({
        link: shareLink
    });
})

module.exports = router;