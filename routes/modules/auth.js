const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../models')
const { User } = db

router.post('/third-party-login', ((req, res) => {
  const { email, displayName } = req.body
  
  User.findOne({ where: { email } })
      .then(user => {

        if (user) {
          const userData = user.toJSON()
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
          return res.json({ status: 'success 成功登入', data:{ userData: user, token } })
        }

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
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
            res.json({ status: 'success 取得使用者資料',  data:{ userData: user, token } })
          })
          .catch(err => console.log(err))
      })
}))

module.exports = router