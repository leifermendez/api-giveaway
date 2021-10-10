const mongoose = require('mongoose')

const RaffleScheme = new mongoose.Schema({
        winner: {
            type: Object
        },
        dynamic: {
            type: String,
            enum: ['wait', 'process', 'done'],
            default: 'wait'
        },
        name: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('raffle', RaffleScheme)
