const db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.regUser = function (req,res) {
    const userinfo = req.body
    const sql = 'select * from users where username=?'
    db.query(sql,userinfo.username,function (err,results) {
        if(err) return res.cc(err)
        if(results.length != 0){
            return res.cc('用户已注册！')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        const sql = 'insert into users (username,password) values (?,?)'
        db.query(sql,[userinfo.username,userinfo.password],function (err,results) {
            if(err) return res.cc(err)
            if(results.affectedRows != 1){
                return res.cc('注册失败！')
            }
            res.cc('注册成功！',0)
        })
    })
}

exports.login = function (req,res) {
    const userinfo = req.body
    const sql = 'select * from users where username=?'
    db.query(sql,userinfo.username,function (err,results) {
        if(err) return res.cc(err)
        if(results.length != 1){
            return res.cc('没有用户信息请注册！')
        }
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult){
            return res.cc('密码错误！')
        }
        const user = {...results[0],password:'',user_pic:''}
        const tokenStr = jwt.sign(user,config.jwtSecrte,{expiresIn:'20h'})
        res.send({
            status:0,
            message:'登陆成功！',
            token:'Bearer ' + tokenStr,
        })
    })
}

