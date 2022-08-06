const db = require('../models')
const { User, Category, Product } = db
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
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => cb(null, { categories, category } ))
      .catch(err => cb(err))
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  putCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error ("category doesn't exist!")
        return category.update({ name })
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  deleteCategory: (req, cb) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },

  // Product
  getProducts: (req, cb) => {
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([
      Product.findAll({
        // 若沒raw會拿到sequelize物件
        raw: true,
        nest: true,
        include: [Category],
        where: {  // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
      }),
      
      Category.findAll({
        raw: true
      })
    ])
      .then(([products, categories]) => {
        let FavoritedProductsId
        let CartProductsId

        if(req.user) {
          FavoritedProductsId = req.user && req.user.FavoritedProducts.map(fr => fr.id)
          CartProductsId = req.user && req.user.CartProducts.map(fr => fr.id)
        }
        
        cb(null, { 
          products,
          categories,
          categoryId,
        })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices