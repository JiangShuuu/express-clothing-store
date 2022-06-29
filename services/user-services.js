const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userServices = {
  signUp: (req, cb) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then((newUser) => cb(null, { user: newUser}))
      .catch(err => cb(err))
  }
}

module.exports = userServices
