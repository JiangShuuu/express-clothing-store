const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userServices = {
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
      nest: true
    })
      .then(user => {
        if (!user) throw new Error ("User didn't exist!")
        delete user.password
        
        cb(null, { user })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
