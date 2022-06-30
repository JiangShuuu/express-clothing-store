const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')

router.post('/users/register', userController.signUp)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) 
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router