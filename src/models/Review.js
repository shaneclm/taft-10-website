const { Schema, SchemaTypes, model } = require('mongoose');

const reviewSchema = new Schema({
    username: {
        type: SchemaTypes.String,
        required: true,
    },
    reviews: [{
        id: {
            type: SchemaTypes.Number,
            required: true,
            unique: true
            // TODO use Model.count() method in app.js to set ID- used to count the number of documents present in the collection 
        },
        rating: {
            type: SchemaTypes.Number,
            required: true
        },
        date: {
            type: SchemaTypes.Date,
            required: true
        },
        upvotes: {
            type: SchemaTypes.Number,
            default: 0
        },
        review: { 
            type: SchemaTypes.String,
            required: true
        },
        establishmentName: {
            type: SchemaTypes.String,
            required: true
        }
    }]
})

module.exports = model("Review", reviewSchema)