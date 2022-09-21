const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin, authIsUser } = require('../middleware/api-auth') 
const productController = require('../controllers/product-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const auth = require('./modules/auth')
const userServices = require('../services/user-services')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/auth', auth)

// User
router.get('/users/:id', userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.post('/users/register', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/current_user', authenticated, userController.getCurrentUser)

// Product
router.get('/products/search', authIsUser, productController.searchProducts)
router.get('/products/top', authIsUser, productController.getTopProducts)
router.get('/products', authIsUser, productController.getProducts)
router.get('/product/:id', authIsUser, productController.getProduct)

// Comment
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// Feeds
router.get('/products/feeds', productController.getFeeds)

// Favorite
router.post('/foverite/:productId', authenticated, userController.addFavorite)
router.delete('/foverite/:productId', authenticated, userController.removeFavorite)

// Cart
// router.get('/carts', authenticated, userController.getCarts)
router.post('/cart/:id', authenticated, userController.addCart)
router.delete('/cart/:id', authenticated, userController.removeCart)

// ProductCount
router.post('/cart-add-count/:productId', authenticated, userController.addCount)
router.post('/cart-reduce-count/:productId', authenticated, userController.reduceCount)

// Order
router.get('/orders', authenticated, userController.getOrders)
router.post('/order', authenticated, userController.addOrder)
router.delete('/order/:id', authenticated, userController.deleteOrder)

router.use('/', apiErrorHandler)

module.exports = router