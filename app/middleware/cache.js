const getExpeditiousCache = require('express-expeditious');

const defaultOptions = {
    namespace: 'expresscache',
    defaultTtl: '1 hour', //TODO: 60 * 1000
    statusCodeExpires: {
        404: '5 minutes',
        500: 0 // 1 minute in milliseconds
    }
}

const cacheInit = getExpeditiousCache(defaultOptions)

module.exports = { cacheInit }
