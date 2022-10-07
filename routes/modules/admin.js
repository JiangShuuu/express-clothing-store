const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')
const productController = require('../../controllers/product-controller')
const commentController = require('../../controllers/comment-controller')
const upload = require('../../middleware/multer')

// user
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.get('/users/:id', userController.getUser)

// Product
router.get('/product/:id/edit', productController.editProduct)
router.put('/product/:id', upload.single('image'), productController.putProduct)
router.delete('/product/:id', productController.deleteProduct)
router.get('/product/:id', productController.getProduct) // 考慮註銷
router.get('/products', adminController.getProducts) // 考慮註銷
router.post('/product', upload.single('image'), productController.postProduct)

// Category
router.get('/categories/:id', adminController.getCategories)
router.put('/categories/:id', adminController.putCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.get('/categories', adminController.getCategories)
router.post('/categories', adminController.postCategory)

// Comment
router.delete('/comments/:id', commentController.deleteComment)

// Order
router.get('/orders', adminController.getOrders)
router.delete('/orders/:id', adminController.deleteOrder)

module.exports = router
