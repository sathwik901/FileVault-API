const mongoose = require('mongoose');

const fileAccessLogSchemaRules = {
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'FileModel', required: true },
    accessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
    anonymous: {type: String},
    timeStamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    location: { type: String }
}

const fileAccessLogSchema = new mongoose.Schema(fileAccessLogSchemaRules);

const fileAccessLogModel = mongoose.model('FileAccessLogModel', fileAccessLogSchema);

module.exports = fileAccessLogModel;