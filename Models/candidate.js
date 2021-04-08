const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    name: {
        type: String,
        require:true 
    }
    , id: {
        type: String,
        require:true
    },
    department: {
        type: String,
        require:true
    },
    points: {
        type: Number,
        default:0 
    }
})

module.exports = mongoose.model('candidate', candidateSchema);