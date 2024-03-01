//导入express框架
const express = require('express')
//使用express框架的路由
const router = express.Router()
//导入expressJoi
const expressJoi = require('@escook/express-joi')

//导入userinfo的路由处理模块
const userInfoHandler = require('../router_handle/userinfo.js')

// 上传头像
router.post('/uploadAvatar', userInfoHandler.uploadAvatar)

// 向外暴露路由
module.exports = router

