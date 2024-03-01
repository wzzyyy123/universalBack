const db = require('../db/index.js')
//导入加密中间件
const bcrypt = require('bcryptjs')
// 导入node.js的crypto库生成uuid,是一种对称加密的算法库
const crypto = require('crypto')
// 导入fs处理文件路径
const fs = require('fs')
// 日期
// const moment = require('moment')

exports.uploadAvatar = (req, res) => {
  // 生成头像的唯一标识
  const onlyId = crypto.randomUUID()
  let oldName = req.files[0].filename
  let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8')
  fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
  const sql = 'insert into image set ?'
  db.query(
    sql,
    {
      image_url: 'http://127.0.0.1:3007/upload/${newname}',
      onlyId
    },
    (err, result) => {
      if (err) return res.cc(err)
      res.send({
        onlyId,
        status: 0,
        url: 'http://127.0.0.1:3007/upload/' + newName
      })
    }
  )
}

