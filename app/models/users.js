const mongoose = require('mongoose')

const UserScheme = new mongoose.Schema({
        name: {
            type: String
        },
        idYt: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String
        },
        password: {
            type: String
        },
        isSub: {
            type: Boolean,
            default:false
        },
        role: {
            type: String,
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('users', UserScheme)
