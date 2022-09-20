module.exports = {
  apiErrorHandler (error, req, res, next) {
    const errorCode = error.code

    // 用 instanceof 判斷傳入 err 是否為物件.
    if (error instanceof Error) {
      // 如果是, 則取 err 物件內的 name, message.
      res.status(errorCode).json({
        error: errorCode,
        status: 'error',
        message: `${error.name}: ${error.message}`
      })
    } else {
      // 若不是, 則直接印出.
      res.status(500).json({
        status: 'error',
        message: `${error}`
      })
    }
    // 把 err 傳給下一個 error handler.
    next(error)
  }
}
