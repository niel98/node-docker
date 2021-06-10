const express = require('express')
const controller = require('../controllers/postController')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/')
.get(protect, controller.getAllPosts)
.post(protect, controller.createPost)

router.route('/:id')
.get(protect, controller.getPost)
.patch(protect, controller.updatePost)
.delete(protect, controller.deletePost)

module.exports = router