const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Product, Favorite, Cart } = db

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
  getCurrentUser: async (req, cb) => {
    try {
      const userId = req.user.id
      const currentUser = await User.findByPk(userId, {
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
      cb(null, currentUser)
    } catch (err) {
      cb(err)
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
  },
  addFavorite: (req, cb) => {
    const { productId } = req.params
    return Promise.all([
      Product.findByPk(productId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          productId
        }
      })
    ])
      .then(([product, favorite]) => {
        if (!product) throw new Error ("Product didn't exist!")
        if (favorite) throw new Error ("You have favorited this Product!")

        return Favorite.create({
          userId: req.user.id,
          productId
        })
      })
      .then(() => cb(null))
      .catch((err) => cb(err))
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.productId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this Product!")

        return favorite.destroy()
      })
      .then(() => cb(null, {}))
      .catch(err => cb(err))
  },
  addCart: (req, cb) => {
    const { productId } = req.params
    return Promise.all([
      Product.findByPk(productId),
      Cart.findOne({
        where: {
          userId: req.user.id,
          productId
        }
      })
    ])
      .then(([product, cart]) => {
        if (!product) throw new Error ("Product didn't exist!")
        if (cart) throw new Error ("You're Cart have this Product!")

        return Cart.create({
          userId: req.user.id,
          productId
        })
      })
      .then(() => cb(null, {}))
      .catch(err => cb(err))
  },
  removeCart: (req, cb) => {
    return Cart.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.productId
      }
    })
      .then(cart => {
        if (!cart) throw new Error ("You're Cart haven't add this Product!")

        return cart.destroy()
      })
      .then(() => cb(null, {}))
      .catch(err => cb(err))
  },
  getCarts: async (req, cb) => {
    const userId = req.user.id
    let products = []
    const carts = await Cart.findAll({
      raw: true,
      where: { userId: `${userId}` },
    })
      .then(cart => {
        return cart
      })
      .catch(err => cb(err))
    
    carts.map(items => {
      Product.findByPk(items.productId, {
        raw: true
      })
        .then(product => {
          products.push(product)
        })
        .catch(err => cb(err))
    })
    // 異步問題, 拿不到資料
    console.log(products)
    await cb(null, { products })
  }
}

module.exports = userServices
