const { Schema, SchemaTypes, model } = require('mongoose');
const File = require("./File");

const userSchema = new Schema({
    username: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    email: {
        type: SchemaTypes.String,
        required: true
    },
    lastName: {
        type: SchemaTypes.String,
        required: true
    },
    firstName: {
        type: SchemaTypes.String,
        required: true
    },
    bio: {
        type: SchemaTypes.String,
        required: true
    },
    phoneNum: {
        type: SchemaTypes.String,
        required: false
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },
    profilePicture: {
        type: Schema.Types.ObjectId, 
        ref: 'File', 
        required: true
    },
    isOwner: {
        type: SchemaTypes.Boolean,
        required: true
    },
    numReviews: {
        default: 0,
        type: Number
    },
    establishments: [{
        type: SchemaTypes.String
    }]
})

module.exports = model("User", userSchema)