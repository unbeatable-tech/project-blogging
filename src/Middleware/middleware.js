const jwt = require('jsonwebtoken')
const authorModel=require('../model/authorModel')
const BlogModel = require('../model/blogModel')


const midAuthentication = async function (req, res, next) {


    try {


        const token = req.headers['x-api-key']
        if (!token) {
           return  res.status(400).send({ status: false, msg: "Please Provide Token" })
        }

        const validToken = jwt.verify(token, "projectOne-Group14")
        req.validToken = validToken
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: true, msg: error.message })
    }

}
module.exports.midAuthentication = midAuthentication





const midAuthoriztion = async function (req, res, next) {
    try {

        let id = req.params.blogId


        let blogs = await BlogModel.findById(id).select({ authorId: 1, _id: 0 })
        if (!blogs) {
            return res.status(404).send({ status: false, msg: "Please provide valid blog id" })
        }
        let jwtToken = req.headers['x-api-key']
        if (!jwtToken) {
            return res.status(400).send({ status: false, msg: "KINDLY ADD TOKEN" });
        }

        let verifiedToken = jwt.verify(jwtToken, "projectOne-Group14")
        if (verifiedToken.authorId != blogs.authorId) {
            return res.send(403).status({ status: false, msg: "not Authorized" })
        }

        next()
    }


    catch (error) {
        console.log(error)
        res.status(500).send({ status: true, msg: error.message })
    }

}


module.exports.midAuthoriztion = midAuthoriztion