const express = require ('express')
const mongoose = require ('mongoose')
const cors = require('cors')
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config')
const session = require('express-session')
const redis = require('redis')
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')

const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect(mongoURI, 
        { useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true })
        .then(() => console.log('Successfully connected to the DB'))
        .catch(err => {
            console.log(err)
            setTimeout(connectWithRetry, 5000)
            })
}

connectWithRetry()

const app = express()

app.enable('trust proxy')
app.use(session({
    store: new RedisStore({ client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}))

app.use(express.json())

app.use(cors())

app.get('/api/v1', (req, res) => {
    res.send('<h2>Hi There</h2>')
    console.log('Yeah it ran')
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server running on ${PORT}`))