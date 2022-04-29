const express = require('express')
const router = express.Router()

const AuthorController = require('../controlller/authorController')
const BlogController = require('../controlller/blogcontroller')
const loginController=require("../controlller/loginController")
const middleWare=require("../Middleware/middleware")

router.post('/createAuthor', AuthorController.createAuthor)
router.post('/login',loginController.login)
router.post('/blog',middleWare.mid, BlogController.createBlog)
router.get('/getBlog',middleWare.mid, BlogController.getBlog)


router.put('/blogs/:blogId',middleWare.mid, BlogController.updateBlog)
router.delete('/blogs/:blogId',middleWare.mid, BlogController.deleteBlog)
router.delete('/blogs',middleWare.mid, BlogController.deletebyquery)






module.exports = router