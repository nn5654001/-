const express = require('express')
const user_handle = require('../router_handle/user')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const {reg_login_schema} = require('../schema/index')


router.post('/reguser',expressJoi(reg_login_schema),user_handle.regUser)
router.post('/login',expressJoi(reg_login_schema),user_handle.login)

module.exports = router