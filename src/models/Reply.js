const { Schema, SchemaTypes, model } = require('mongoose');
const Review = require("./Review");

const replySchema = new Schema({
    estOwner: {
        type: SchemaTypes.String,
        required: true,
    },
    userReview: { 
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    reply: {
        type: SchemaTypes.String
    }
})

module.exports = model("Reply", replySchema)