const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getUsers: (req, cb) => {
    User.findAll({
      // 若沒raw會拿到sequelize物件
      raw: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          throw new Error("root can't not change!")
        }

        user.isAdmin === false ? user.isAdmin = true : user.isAdmin = false

        return user.update({
          isAdmin: user.isAdmin
        })
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  getCategories: (req, cb) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => cb(null, {categories}))
  }
}

module.exports = adminServices