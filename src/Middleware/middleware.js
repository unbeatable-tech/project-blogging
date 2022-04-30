 const jwt=require('jsonwebtoken')
 const BlogModel=require('../model/blogModel.js')


 const midAuthentication =async function(req,res,next){


    try{


        const token=req.headers['x-api-key']
        if(!token){
            res.status(400).send({status:false,msg:"Please Provide Token"})
        }

        const validToken=jwt.verify(token,"projectOne-Group14")
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
 module.exports.midAuthentication=midAuthentication





 const midAuthoriztion=async function(req,res,next){
     try{

let id=req.params.blogId
let jwtToken=req.headers['x-api-key']

let blogs=await BlogModel.findById(id)
if(!blogs){
    return res.status(404).send({status:false,msg:"Please provide valid blog id"})
}
if(blogs.isDeleted===true){
    return res.status(404).send({status:false,msg:"No such blog found Blog is already deleted"})
}
       
let verifiedToken=jwt.verify(jwtToken,"projectOne-Group14")
if(verifiedToken.authorId !=blogs.authorId)
res.send(403).status({status:false,msg:"Unauthorize Access"})

next()
     }


     catch(error){
        console.log(error)
        res.status(500).send({status:true,msg:error.message})
    }

 }


module.exports.midAuthoriztion=midAuthoriztion