const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')
const productController = require('../../controllers/product-controller')
const upload = require('../../middleware/multer')
// user
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.get('/users/:id', userController.getUser)

// Product
router.post('/product', upload.single('image'), productController.postProduct)
router.get('/product/:id/edit', productController.editProduct)
router.put('/product/:id', upload.single('image'), productController.putProduct)
router.delete('/product/:id', productController.deleteProduct)
router.get('/products', productController.getProducts)
router.get('/product/:id', productController.getProduct)

// category
router.get('/categories/:id', adminController.getCategories)
router.put('/categories/:id', adminController.putCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.get('/categories', adminController.getCategories)
router.post('/categories', adminController.postCategory)

module.exports = router
