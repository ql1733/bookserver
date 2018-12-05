const express = require('express')
const socketIo = require('socket.io');
const db = require('./mongodb/db.js')
const config = require('config-lite')(__dirname)
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const path = require('path')
const router = require('./routers/index.js')
const app = express()




app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.Origin || req.headers.origin || 'http://localhost:6800:8081')
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
})
app.use(express.static(path.join(__dirname, 'publice')))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

const MongoStore = connectMongo(session);
app.use(cookieParser());
// app.use(session({
//     name: config.session.key,
//     secret: config.session.secret,
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: config.session.maxAge
//     },
//     store: new MongoStore({
//         url: config.url
//     })
// }))
app.use(session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: config.session.cookie,
    store: new MongoStore({ // 将 session 存储到 mongodb
        url: config.url // mongodb 地址
    })
}))

router(app)
app.use(express.static('./public'));
const server = require('http').createServer(app);
let io = socketIo.listen(server)
io.on('connection', function(socket){
    console.log(1)
    socket.on('news', (data)=>{
        console.log(data)
        console.log(2)
        io.emit('news',data)
    })
   
  });

server.listen(config.port, () => {
    console.log(`${config.port}`)
})

//supervisor index