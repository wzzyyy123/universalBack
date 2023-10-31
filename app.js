const express = require('express')
const app = express()                //引入express   npm i express -s

//导入cors
const cors = require('cors')
//全局挂在cors
app.use(cors())

//绑定和侦听指定的主机和端口
app.listen(3007, () => {
	console.log('http://127.0.0.1:3007:')
})