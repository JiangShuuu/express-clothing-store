const commentServices = require('../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, err => err ? next(err) : res.json({ status: 'success 新增commemt' }))
  }
}

module.exports = commentController