const passport = require('passport')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local')
const { User, Product } = require('../models')

// 新增這兩行
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  
  (req, email, password, cb) => {
    const error = new Error()
    User.findOne({ where: { email } })
      .then(user => {
        
        if (!user) {
          error.code = 400
          error.message = "帳號或密碼輸入錯誤！"
          return cb(error)
        } 

        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            error.code = 400
            error.message = "帳號或密碼輸入錯誤！"
            return cb(error)
          } 
          return cb(null, user)
        })
          .catch(err => cb(err))
      })
      .catch(err => cb(err))
  }
))

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Product, as: 'FavoritedProducts' },
      { model: Product, as: 'CartProducts' }
    ]
  })
    .then(user => {
      const userData = user.toJSON()
      delete userData.password

      cb(null, userData )
    })
    .catch(err => cb(err))
}))

module.exports = passport