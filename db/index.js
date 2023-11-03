//引入mysql
const mysql = require('mysql')
//创建与数据库的链接
const db = mysql.createPool({
	host:'localhost',
	user:'wzy',
	password:'357927',
	database:'backsystem'
})

//对外暴露数据库
module.exports = db