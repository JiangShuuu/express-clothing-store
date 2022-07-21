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

router.get('/products', productController.getProducts)
router.post('/product', upload.single('image'), productController.postProduct)
router.get('/product/:id/edit', productController.editProduct)
router.put('/product/:id', upload.single('image'), productController.putProduct)
router.get('/product/:id', productController.getProduct)
router.delete('/product/:id', productController.deleteProduct)

// Comment
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// Feeds
router.get('/products/feeds', authenticated, productController.getFeeds)

router.use('/', apiErrorHandler)

module.exports = router