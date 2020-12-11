const express = require('express')
const cors = require('cors')
const user = require('./router/user')
const expressjwt = require('express-jwt')
const config = require('./config')

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(function (req,res,next) {
    res.cc = function (err,status=1) {
        res.send({
            status,
            message:err instanceof Error? err.message:err
        })
    }
    next()
})
// app.use()
app.use(expressjwt({secret:config.jwtSecrte}).unless({path:[/^\/api\//]}))


app.use('/api',user)



app.use(function (err,req,res,next) {
    if(err.name == 'ValidationError'){
        return res.cc(err)
    }
    res.cc(err)
})


app.listen(80,function () {
    console.log("服务器已启动 端口80");
})