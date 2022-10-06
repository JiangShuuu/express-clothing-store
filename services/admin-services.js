const db = require('../models')
const { User, Category, Product, Order } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const error = new Error()

const adminServices = {
  // User
  getUsers: (req, cb) => {
    User.findAll({
      // 若沒raw會拿到sequelize物件
      raw: true
    })
      .then(users => cb(null, { users }))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  patchUser: (req, cb) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          error.code = 400
          error.message = "使用者不存在!"
          return cb(error)
        }

        if (user.email === 'root@example.com') {
          error.code = 400
          error.message = "root不能更改!"
          return cb(error)
        }

        user.isAdmin === false ? user.isAdmin = true : user.isAdmin = false

        return user.update({
          isAdmin: user.isAdmin
        })
      })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },

  // Category
  getCategories: (req, cb) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => cb(null, { categories, category } ))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) {
      error.code = 400
      error.message = "名稱為必填!"
      return cb(error)
    }
    return Category.create({ name })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  putCategory: (req, cb) => {
    const { name } = req.body

    if (!name) {
      error.code = 400
      error.message = "名稱為必填!"
      return cb(error)
    }

    return Category.findByPk(req.params.id)
      .then(category => {

        if (!category) {
          error.code = 400
          error.message = "類別不存在!"
          return cb(error)
        }

        return category.update({ name })
      })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        return cb(error)
      })
  },
  deleteCategory: (req, cb) => {
    return Category.findByPk(req.params.id)
      .then(category => {

        if (!category) {
          error.code = 400
          error.message = "類別不存在!"
          return cb(error)
        }

        return category.destroy()
      })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        cb(error)
      })
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
      .catch(error => {
        error.code = 500
        cb(err)
      })
  },

  // Order
  getOrders: (req, cb) => {
    return Order.findAll({ 
        include: [
          { model: User, attributes: ['id', 'name', 'email']},
          { model: Product, as: 'OrderProducts', attributes: ['id', 'title', 'price', 'og_price', 'image'] }
        ]
      })
        .then((orders) => {
          console.log(orders)
          if (!orders) {
            error.code = 400
            error.message = "訂單不存在!"
            return cb(error)
          }

          cb(null, { orders })
        })
        .catch(error => {
          error.code = 500
          cb(error)
        })
  }
}

module.exports = adminServices