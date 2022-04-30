const express = require('express')
const router = express.Router()

const AuthorController = require('../controlller/authorController')
const BlogController = require('../controlller/blogcontroller')
const loginController=require("../controlller/loginController")
const middleWare=require("../Middleware/middleware")

router.post('/createAuthor', AuthorController.createAuthor)
router.post('/login',loginController.login)
router.post('/blog', BlogController.createBlogs)
router.get('/getBlog',middleWare.midAuthentication, BlogController.getBlogs)


router.put('/blogs/:blogId',middleWare.midAuthoriztion, BlogController.updateBlogs)
router.delete('/blogs/:blogId',middleWare.midAuthoriztion, BlogController.deleteBlogByid)
router.delete('/blogs',middleWare.midAuthentication, BlogController.deleteBlogByQuerConditoin)






module.exports = router