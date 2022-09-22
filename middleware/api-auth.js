const passport = require('../config/passport') // 引入 passport

const authIsUser = ( req, res, next ) => {
  function cb(error, user) {
    if (!error && user) req.user = user
    return next()
  }

  const verify = passport.authenticate('jwt', { session: false }, cb)
  verify(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const error = new Error()

    if (err || !user) {
      error.code = 422
      error.message = '使用者未從登入驗證獲取憑證不予使用'
      return next(error)
    }

    req.user = user
    return next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authIsUser,
  authenticatedAdmin
}