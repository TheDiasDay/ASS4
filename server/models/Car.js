const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CarSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    } 
},
    {
        timestamps: true  
    });

module.exports = mongoose.model('Car', CarSchema);