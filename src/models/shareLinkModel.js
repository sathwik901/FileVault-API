const mongoose = require('mongoose');

const shareLinkSchemaRules = {
    fileId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'FileModel',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    maxDownloads: {
        type: Number,
        default: null
    },
    downloadsSoFar: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}

const shareLinkSchema = new mongoose.Schema(shareLinkSchemaRules);

const shareLinkModel = mongoose.model('ShareLinkModel', shareLinkSchema);

module.exports = shareLinkModel;