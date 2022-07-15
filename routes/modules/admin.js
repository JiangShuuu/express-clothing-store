const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// user
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

// category
router.get('/categories/:id', adminController.getCategories)
router.put('/categories/:id', adminController.putCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.get('/categories', adminController.getCategories)
router.post('/categories', adminController.postCategory)

module.exports = router
