const config = require('config-lite')(__dirname)
const mongoose = require('mongoose')
mongoose.connect(config.url, { useNewUrlParser: true })
mongoose.Promise = global.Promise

const db = mongoose.connection;

db.once('open', () => {
    console.log('数据库连接成功')
})
db.on('error', (error) => {
    console.error(error)
    mongoose.disconnect()
})
db.on('close', () => {
    console.log('数据库断开')
    mongoose.connect(config.url, { server: { auto_reconnect: true } })
})
module.exports = db