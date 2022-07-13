const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// router.put('/users/:id', adminController.putUsers)
router.get('/users', adminController.getUsers)

module.exports = router
