const { Schema, SchemaTypes, model } = require('mongoose');

const fileSchema = new Schema({
    path: {
        type: SchemaTypes.String,
        required: true
    },
    fileName: {
        type: SchemaTypes.String,
        required: true
    }
})

module.exports = model("File", fileSchema)