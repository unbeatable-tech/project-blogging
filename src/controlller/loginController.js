const authorModel = require('../model/authorModel')

const jwt = require('jsonwebtoken')


const login = async function (req, res) {




    try {

 let check=req.body
 if(check.length ===0){
     return res.status(400).send({status:false,msg:"Invalid request Parameters.Please provide login details"})
 }

 if(req.body.email && req.body.password){

    const details=await authorModel.findOne({email:req.body.email,password:req.body.password})
    if(!details){
        return res.status(400).send({status:false,msg:"invalid credentials"}) 
    }
    let payload={_id:details._id}
    let secret="Group14"
    let token=jwt.sign(payload,secret)
    res.setHeader("x-api-key",token)
    res.status(200).send({status:true,msg:"Author Login succesfully",data:token})

 }
 else{
     res.status(400).send({status:false,msg:"must contain email and password"})
 }



 
}
catch(error){
    console.log(error)
    res.status(500).send({status:false,msg:error.message})
}

 }

module.exports.login=login