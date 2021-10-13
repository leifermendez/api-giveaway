const mongoose = require('mongoose')

const BlackListScheme = new mongoose.Schema({
        url: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('blacklists', BlackListScheme)
