const commentServices = require('../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, err => err ? next(err) : res.json({ status: 'success 新增commemt' }))
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, err => err ? next(err) : res.json({ status: 'success 刪除comment' }))
  }
}

module.exports = commentController