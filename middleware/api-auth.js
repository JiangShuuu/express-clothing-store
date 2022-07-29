const passport = require('../config/passport') // 引入 passport

const authIsUser = ( req, res, next ) => {
  function cb(error, user) {
    if (!error && user) req.user = user
    return next()
  }

  const verify = passport.authenticate('jwt', { session: false }, cb)
  verify(req, res, next)
}

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authIsUser,
  authenticatedAdmin
}