const db = require('../models')
const { User } = db

const adminServices = {
  getUsers: (req, cb) => {
    User.findAll({
      // 若沒raw會拿到sequelize物件
      raw: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices