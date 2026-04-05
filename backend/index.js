const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.set("trust proxy", 1);
app.use(cors({
    origin :[process.env.FRONTEND_URL, "http://localhost:3000"],
    // origin : 'http://localhost:3000',
    credentials : true
}))
console.log("Frontend Url is :",process.env.FRONTEND_URL)
app.use(express.json())
app.use(cookieParser())

app.use("/api",router)

app.get("/", (req, res) => {
    res.send("Hello from backend!")
})

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running at http://localhost:"+PORT)
    })
})
