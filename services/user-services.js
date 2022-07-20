const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Product } = db

const userServices = {
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天

      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  signUp: (req, cb) => {

    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then((newUser) => cb(null, { user: newUser}))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    User.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [
        Comment,
        { model: Comment, include: Product }
      ]
    })
      .then(user => {
        if (!user) throw new Error ("User didn't exist!")
        delete user.password

        cb(null, { user })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => cb(null, { user }))
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name, email, password } = req.body
    if (!email) throw new Error('User email is required!')

    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          email,
          password
        })
      })
      .then(updateUser => cb(null, { updateUser }))
      .catch(err => cb(err))
  }
}

module.exports = userServices
