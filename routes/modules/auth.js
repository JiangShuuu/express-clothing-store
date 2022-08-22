const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../models')
const { User } = db

router.post('/third-party-login', ((req, res) => {
  const { email, displayName } = req.body
  const token = jwt.sign(req.body, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
  User.findOne({ where: { email } })
      .then(user => {
        if (user) return res.json({ status: 'success 成功登入', data:{ user, token } })
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name: displayName,
            email,
            password: hash
          }))
          .then(user => {
            res.json({ status: 'success 取得使用者資料',  data:{ user, token } })
          })
          .catch(err => console.log(err))
      })
}))

module.exports = router