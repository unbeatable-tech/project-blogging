 const jwt=require('jsonwebtoken')
 const BlogModel=require('../model/BlogModel')


 const mid =async function(req,res,next){


    try{


        const token=req.headers['x-api-key']
        if(!token){
            res.status(400).send({status:false,msg:"Please Provide Token"})
        }

        const validToken=jwt.verify(token,"Group14")
        if(!validToken){
            res.status(400).send({status:false,msg:"Authentication failed"})
        }
    next()
    }
    catch(error){
        console.log(error)
        res.status(500).send({status:true,msg:error.message})
    }

 }
 module.exports.mid=mid


