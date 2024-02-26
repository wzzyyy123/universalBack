const db = require('../db/index.js')
//导入加密中间件
const bcrypt = require('bcryptjs')
//导入jwt和jwt配置文件
const jwt = require('jsonwebtoken')
const jwtconfig = require('../jwt_config/index.js')

exports.register = (req, res) => {
	const reginfo = req.body
	//第一步判空
	if (!reginfo.account || !reginfo.password) {
		return res.send({
			status: 1,
			message: '账号或者密码不能为空'
		})
	}
	//第二步判断前端输入的账号是否存在于数据库中
	//需要使用mysql的select语句
	const sql = 'select * from users where account = ?'
	//第一个参数是执行语句，第二个是查询参数，第三个是一个函数用于处理结果
	db.query(sql, reginfo.account, (err, results) => {
		if (results.length > 0) {
			return res.send({
				status: 1,
				message: '账号已存在'
			})
		}
		//第三步，对密码进行加密
		//需要使用加密中间件bcrypt.js
		reginfo.password = bcrypt.hashSync(reginfo.password, 10)
		//第四步把账号和密码插入到user表里面
		const sql1 = 'insert into users set ?'
		const identity = '用户'
		const create_time = new Date()
		db.query(sql1, {
			account: reginfo.account,
			password: reginfo.password,
			identity,
			create_time,
			status: 0
		}, (err, results) => {
			//插入失败，影响的行数不为1
			if (results.affectedRows !== 1) {
				return res.send({
					status: 1,
					message: '注册账号失败'
				})
			}
			res.send({
				status: 1,
				message: '注册账号成功'
			})
		})
	})
}

exports.login = (req, res) => {
	const loginfo = req.body
	const sql = 'select * from users where account = ?'
	db.query(sql, loginfo.account, (err, results) => {
		//执行sql语句失败的情况，一般在数据库断开的情况会执行失败
		if (err) return res.cc(err)
		//查询数据表中有没有对应的账号
		if (results.length !== 1) return res.cc('登录失败')
		//第二步 查询到账号后对前端传过来的密码进行解密
		const compareResult = bcrypt.compareSync(loginfo.password, results[0].password)
		if (!compareResult) {
			return res.cc('登录失败')
		}
		//第三步，判断账号是否冻结
		if (results[0].status == 1) {
			return res.cc('账号被冻结')
		}
		//第四步，生成返回给前端的token
		//提出加密后的密码，头像，创建时间，更新事件
		const user = {
			...results[0],
			password: '',
			imageUrl: '',
			create_time: '',
			update_time: ''
		}
		//设置token的有效时长,7小时
		const tokenStr = jwt.sign(user, jwtconfig.jwtSecretkey, {
			expiresIn: '7h'
		})
		res.send({
			results: results[0],
			status: 0,
			message: '登录成功',
			token: 'Bearer ' + tokenStr
		})
	})
}