require('dotenv').config()
const epxress = require('express')
const cors = require('cors')
const app = epxress()
const server = require('http').Server(app);
const {dbConnect} = require('./config/mongo')
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
})

require('./app/service/socket')(io)
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(epxress.json())

app.use('/api/1.0', require('./app/routes'))

dbConnect()

server.listen(PORT, () => console.log('Listo Server'))
