const mongoose = require("mongoose");

const userSchemaRules = {
    userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sharedFiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileModel'
    }]
}

const userSchema = new mongoose.Schema(userSchemaRules)

const userModel = mongoose.model("UserModel", userSchema);

module.exports = userModel;