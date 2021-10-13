const ROOM = 'room-winner';
const raffleModel = require('../models/raffle')
const blackListModel = require('../models/backList')
const commentsModel = require('../models/comments')

const getBlackList = () => {
    return blackListModel.find({})
}

const getRandom = async () => {
    let blackListArray = await getBlackList()
    blackListArray = blackListArray.map(a => a.url)

    const random = await commentsModel.aggregate(
        [
            {
                $match: {
                    authorChannelUrl: {$nin: [...blackListArray]}
                }
            },
            {
                $sample: {size: 1}
            }
        ])
    const dataRaffle = {
        winner: random.pop(),
        dynamic: 'process'
    }

    return raffleModel.findOneAndUpdate({name: 'pick'}, dataRaffle,
        {
            new: true,
            upsert: true
        });
}

const setWinner = async () => {
    return raffleModel.findOneAndUpdate({name: 'pick'}, {dynamic: 'done'},
        {
            new: true,
            upsert: true
        });
}

const ios = (io) => {
    io.on("connection", (socket) => {
        socket.join(ROOM);

        socket.on('pick-winner', async () => {
            const data = await getRandom()
            socket.to(ROOM).emit('pick-winner', data);
        })

        socket.on('pick-winner-done', async () => {
            const data = await setWinner()
            socket.to(ROOM).emit('pick-winner-done', data);
        })

    });
}
module.exports = (io) => ios(io)
