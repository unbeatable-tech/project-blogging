const express = require('express');
const router = express.Router();
let authorcontroller = require('../controllers/authorController');

const blogController = require('../controllers/blogController')

const {authentication,authorize}=require('../Middleware/middleware')



router.post('/login', authorcontroller.login)
router.post('/authors',authorcontroller.createauthor)
router.post ('/createBlog',authentication,blogController.createBlog)

router.get ('/getBlog',authentication,blogController.getBlog)

router.put('/updateBlog/:blogId',authorize,blogController.updateBlog)



router.delete('/deleteBlog/:blogId',authorize,blogController.deleteBlog)
router.delete('/deletebyquery',authentication,blogController.deletebyquery)



module.exports = router;