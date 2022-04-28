const authorModel = require('../model/authorModel')


let createAuthor = async function(req,res){
    try{
        let data = req.body
        let duplicate = await authorModel.findOne({email:data.email})
        if(duplicate){
            return res.status(400).send({status:false,msg:"EMAIL ALREADY EXISTS"})
        }
    let save = await authorModel.create(data)
    res.status(200).send({msg:save})
}catch(error){
    res.status(500).send({status:false,msg : error.message})
}
}





module.exports.createAuthor=createAuthor