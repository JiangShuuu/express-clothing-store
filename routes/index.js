const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth') 
const productController = require('../controllers/product-controller')
const commentController = require('../controllers/comment-controller')
const upload = require('../middleware/multer')
const admin = require('./modules/admin')

router.use('/admin', authenticated, authenticatedAdmin, admin)

// User
router.get('/users/:id', userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.post('/users/register', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 如何達到不一定要登入取得資料
router.get('/products', authenticated, productController.getProducts)
router.post('/product', upload.single('image'), productController.postProduct)
router.get('/product/:id/edit', productController.editProduct)
router.put('/product/:id', upload.single('image'), productController.putProduct)
// 如何達到不一定要登入取得資料
router.get('/product/:id', authenticated, productController.getProduct)
router.delete('/product/:id', productController.deleteProduct)

// Comment
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// Feeds
router.get('/products/feeds', authenticated, productController.getFeeds)

// Favorite
router.post('/foverite/:productId', authenticated, userController.addFavorite)
router.delete('/foverite/:productId', authenticated, userController.removeFavorite)

// Cart
router.post('/cart/:productId', authenticated, userController.addCart)
router.delete('/cart/:productId', authenticated, userController.removeCart)

router.use('/', apiErrorHandler)

module.exports = router