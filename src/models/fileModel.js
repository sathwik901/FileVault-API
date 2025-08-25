const mongoose = require('mongoose');

const fileSchemaRules = {
    fileName: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    storageType: {
        type: String,
        enum: ['local', 'cloud'],
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now()
    },
    expiryTime:{
        type: String
    }
}

const fileSchema = new mongoose.Schema(fileSchemaRules);

fileSchema.index({ owner: 1, fileName: 1 }, { unique: true });

const fileModel = mongoose.model('FileModel', fileSchema)

module.exports = fileModel;