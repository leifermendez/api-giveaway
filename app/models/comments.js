const mongoose = require('mongoose')

const CommentsScheme = new mongoose.Schema({
        comment: {
            type: String
        },
        author: {
            type: String
        },
        authorChannelUrl: {
            type: String
        },
        video: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('comments', CommentsScheme)
