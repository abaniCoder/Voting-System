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
    }
})

module.exports = mongoose.model('candidate', candidateSchema);