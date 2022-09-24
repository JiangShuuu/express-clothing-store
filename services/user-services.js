const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Product, Favorite, Cart, Order, Orderlist } = db

const BCRYPT_COMPLEXITY = 10
const error = new Error()

const userServices = {
  signIn: async (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password

      const { CartProducts } = await User.findByPk(userData.id, {
        include: [
          { model: Product, as: 'CartProducts' }
        ],
        attributes: []
      })

      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天

      cb(null, { token, user: { userData, CartProducts } })
    } catch (error) {
      error.code = 500
      cb(error)
    }
  },
  signUp: (req, cb) => { 

    if (req.body.password !== req.body.passwordCheck) {
      error.code = 400
      error.message = '兩次 Passwords 不相符, 請重新確認!'
      return cb(error)
    }

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          error.code = 400
          error.message = 'Email 已存在, 請重新輸入!'
          return cb(error)
        }
        return bcrypt.hash(req.body.password, BCRYPT_COMPLEXITY)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        avatar: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039874/twitter/project/defaultAvatar_a0hkxw.png",
        password: hash
      }))
      .then((newUser) => cb(null, { user: newUser}))
      .catch((error) => {
        error.code = 500
        cb(error)
      })
  },
  getCurrentUser: async (req, cb) => {
    try {
      const userId = req.user.id
      const { CartProducts, email, id, isAdmin, name } = await User.findByPk(userId, {
        include: [
          { model: Product, as: 'CartProducts' }
        ],
        attributes: [
          'id',
          'name',
          'email',
          'isAdmin'
        ],
      })
      const userData = { email, id, isAdmin, name }
      cb(null, {user: { userData, CartProducts }})
    } catch (error) {
      error.code = 500
      cb(error)
    }
  },
  getUser: (req, cb) => {
    User.findByPk(req.params.id, {
      include: [
        Comment,
        { model: Comment, include: Product },
        { model: Product, as: 'CartProducts' }
      ]
    })
      .then(user => {
        if (!user) {
          error.code = 400
          error.message = ("使用者不存在!")
          return cb(error)
        }
        delete user.password

        cb(null, { user })
      })
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  editUser: (req, cb) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => cb(null, { user }))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  putUser: (req, cb) => {
    const { name, email, password } = req.body

    if (!email) {
      error.code = 400
      error.message = "User email 為必填!"
      return cb(error)
    }
 
    const { file } = req

    Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
   
        if (!user) {
          error.code = 400
          error.message = "User 不存在!"
          return cb(error)
        }
        return user.update({
          name,
          email,
          avatar: filePath || user.avatar,
          password: bcrypt.hashSync(password, BCRYPT_COMPLEXITY)
        })
      })
        .then(updateUser => {

          const userData = updateUser.toJSON()
          delete userData.password

          cb(null, { updateUser: userData })
        } )
        .catch(error => {
          error.code = 500
          return cb(error)
        })
  },
  addFavorite: (req, cb) => {
    return Promise.all([
      Product.findByPk(req.params.id),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          productId: req.params.id
        }
      })
    ])
      .then(([product, favorite]) => {
        if (!product) {
          error.code = 400
          error.message = "此商品不存在!"
          return cb(error)
        }

        if (favorite) {
          error.code = 400
          error.message = "此商品已存在喜歡名單!"
          return cb(error)
        }

        return Favorite.create({
          userId: req.user.id,
          productId: req.params.id
        })
      })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.id
      }
    })
      .then(favorite => {

        if (!favorite) {
          error.code = 400
          error.message = "此商品不存在喜歡名單中!"
          return cb(error)
        }

        return favorite.destroy()
      })
      .then(() => cb(null, {}))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  addCart: (req, cb) => {
    return Promise.all([
      Product.findByPk(req.params.id),
      Cart.findOne({
        where: {
          userId: req.user.id,
          productId: req.params.id
        }
      })
    ])
      .then(([product, cart]) => {
        if (!product) {
          error.code = 400
          error.message = "此商品不存在!"
          return cb(error)
        } 
        
        if (cart) {
          error.code = 400
          error.message = "此商品已加入購物車!"
          return cb(error)
        }

        return Cart.create({
          userId: req.user.id,
          productId: req.params.id
        })
      })
      .then(() => cb(null, {}))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  removeCart: (req, cb) => {
    return Cart.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.id
      }
    })
      .then(cart => {

        if (!cart) {
          error.code = 400
          error.message = "您的購物車未加入此商品!"
          return cb(error)
        }

        return cart.destroy()
      })
      .then(() => cb(null, {}))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  addCount: (req, cb) => {

    return Cart.findOne({
        where: {
          userId: req.user.id,
          productId: req.params.id,
        },
      })
        .then(cart => {

          if (!cart) {
            error.code = 400
            error.message = "您的購物車未加入此商品!"
            return cb(error)
          }

          cart.increment('productCount')
        })
        .then(() => cb(null, {}))
        .catch(error => {
          error.code = 500
          cb(error)
        })
  },
  reduceCount: (req, cb) => {

    return Cart.findOne({
        where: {
          userId: req.user.id,
          productId: req.params.id,
        },
      })
        .then(cart => {

          if (!cart) {
            error.code = 400
            error.message = "您的購物車未加入此商品!"
            return cb(error)
          }

          if (cart.productCount === 0) {
            error.code = 400
            error.message = "不能再扣拉!"
            return cb(error)
          }

          cart.decrement('productCount')
        })
        .then(() => cb(null, {}))
        .catch(error => {
          error.code = 500
          cb(error)
        })
  },
  getOrders: (req, cb) => {
    return Order.findAll({ 
        include: [
          { model: Product, as: 'OrderProducts' }
        ],
        where: {
          userId: req.user.id
        }
      })
        .then((orders) => {
          
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
  },
  addOrder: (req, cb) => {

    const { name, phone, address, total } = req.body
    const userId = req.user.id

    Cart.findAll({
      where: {
        userId
      }
    })
      .then((cart) => {

        if (cart.length < 1) {
          error.code = 400
          error.message = "購物車沒有任何商品!"
          return cb(error)
        }

        Order.create({ 
          name,
          phone,
          address,
          total,
          userId
        })
          .then((order) => {
            cart.map(item => {
              Orderlist.create({
                orderId: order.id,
                productId: item.productId,
                productCount: item.productCount
              })
              item.destroy()
            })
          })
      })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  deleteOrder: (req, cb) => {
    const { id } = req.params
    console.log('123', id)
    return Promise.all([
      Order.findOne({
        where: {
          userId: req.user.id,
          id: id
        }
      }),
      Orderlist.findAll({
        where: {
          orderId: id
        }
      })
    ])
      .then(([order, orderlist]) => {

        if (!order || !orderlist) {
          error.code = 400
          error.message = "訂單不存在!"
          return cb(error)
        }

        order.destroy()
        orderlist.map(item => {
          item.destroy()
        })
      })
      .then(() => cb(null))
      .catch((error) => {
        error.code = 500
        cb(error)
      })
  }
}

module.exports = userServices
