const express=require('express')
const router=express.Router()

const AuthorController=require('../controlller/authorController')
const BlogController=require('../controlller/blogcontroller')

router.post('/createAuthor',AuthorController.createAuthor)
router.post('/blog',BlogController.createBlog)
router.get('/getBlog',BlogController.getBlog)


router.put('/blogs/:blogId',BlogController.updateBlog)
router.delete('/blogs/:blogId',BlogController.deleteBlog)
router.delete('/blogs',BlogController.deletebyquery)






module.exports=router