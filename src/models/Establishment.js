const { Schema, SchemaTypes, model } = require('mongoose');


const establishmentSchema = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    rating: {
        type: SchemaTypes.String,
        default: '0'
    },
    priceRange: {
        type: [SchemaTypes.String], 
        required: true
    },
    tags: {
        type: [SchemaTypes.String], 
        required: true
    },
    description: {
        type: SchemaTypes.String,
        required: true
    },
    coverImage: {
        type: SchemaTypes.String
    },
    reviewsButtonClass: {
        type: SchemaTypes.String
    },
    addReviewClass: {
        type: SchemaTypes.String
    }
});

const Establishment = model('Establishment', establishmentSchema);

module.exports = Establishment;