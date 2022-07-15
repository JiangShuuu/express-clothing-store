const db = require('../models')
const { User, Category } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  // User
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

  // Category
  getCategories: (req, cb) => {
    Category.findAll({
      raw: true
    })
      .then(categories => cb(null, { categories } ))
      .catch(err => cb(err))
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => cb(null))
      .catch(err => cb(null))
  }
}

module.exports = adminServices