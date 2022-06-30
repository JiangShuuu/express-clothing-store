module.exports = {
  // generalErrorHandler (err, req, res, next) {
  //   if (err instanceof Error) {
  //     req.flash('error_messages', `${err.name}: ${err.message}`)
  //   } else {
  //     req.flash('error_messages', `${err}`)
  //   }
  //   res.redirect('back')
  //   next(err)
  // },
  apiErrorHandler (err, req, res, next) {
    // 用 instanceof 判斷傳入 err 是否為物件.
    if (err instanceof Error) {
      // 如果是, 則取 err 物件內的 name, message.
      res.status(500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      // 若不是, 則直接印出.
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    // 把 err 傳給下一個 error handler.
    next(err)
  }
}
