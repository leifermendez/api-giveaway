const {httpError} = require('../helpers/handleError')
const raffleModel = require('../models/raffle')
const commentsModel = require('../models/comments')

const getItems = async (req, res) => {
    try {
        const pick = await raffleModel.findOne({})

        //TODO: Simular delay 2 segundos
        const listComments = await commentsModel.find({})
        res.send({data: pick, comments: listComments})


    } catch (e) {
        httpError(res, e)
    }
}


module.exports = {getItems}
