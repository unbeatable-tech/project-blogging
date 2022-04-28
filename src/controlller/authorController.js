const authorModel = require('../model/authorModel')


const createAuthor=async function(req,res){


    try{


        let data=req.body
        if(data){
            let savedData= await authorModel.create(data)
            res.status(201).send({status:true,mgs:savedData})
        }
        else{
            res.status(400).send({status:false,msg:"mandatory body missing"})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send({status:false,msg:error.message})
    }
}

module.exports.createAuthor=createAuthor