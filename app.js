//引入express框架   npm i express -s
const express = require('express')
//创建express实例
const app = express()
//导入body-parser
var bodyParser = require('body-parser')

//导入cors
const cors = require('cors')
//全局挂载cors
app.use(cors())

// 全局挂载multer
// multer.js是一个node.js的 中间件，用于处理multiport/form-data类型的表单数据，主要用于上传文件
const multer = require('multer')
// multer的配置
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片
const upload = multer({ dest: './public/upload' })
app.use(upload.any())
// 静态托管
app.use(express.static('./public'))

//parse application/x-www-form-urLencoded   urlencoded表示默认json的解析类型
//当extended,为false时，值为数组或者字符串，当为ture时，值可以为任意类型
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

//注册一个处理错误的中间件 一定要在路由之前，注册并挂载res.cc函数
app.use((req, res, next) => {
  //默认status=1为失败，0为成功，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      //判断err是一个错误对象还是一个字符串
      message: err instanceof Error ? err.message : err
    })
  }
  //若请求没有错误，则正常进入路由
  next()
})

const jwtconfig = require('./jwt_config/index.js')
//用了ES6的解构赋值
const { expressjwt: jwt } = require('express-jwt')
//使用中间件排除不需要在请求段发送token的接口(注册和登录接口)，用到了正则
// app.use(jwt({ secret: jwtconfig.jwtSecretkey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

const loginRouter = require('./router/login.js')
const userinfoRouter = require('./router/userinfo.js')
const Joi = require('joi')
// /api作为接口的通用前缀
app.use('/api', loginRouter)
app.use('/user', userinfoRouter)

//新建中间件，用于对不符合joi验证规则的数据报错
app.use((req, res, next) => {
  if (err instanceof Joi.ValidationError) return res.cc(err)
})

//绑定和侦听指定的主机和端口
app.listen(3007, () => {
  console.log('http://127.0.0.1:3007:')
})
