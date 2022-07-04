const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth') 
const productController = require('../controllers/product-controller')

router.post('/users/register', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.get('/products', productController.getProducts)
router.post('/product', productController.postProduct)
router.get('/product/:id', productController.getProduct)

router.use('/', apiErrorHandler)

module.exports = router