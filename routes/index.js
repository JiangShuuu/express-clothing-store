const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/users/register', userController.signUp)
router.use('/', apiErrorHandler)

module.exports = router