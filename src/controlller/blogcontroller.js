
const authorModel=require('../model/authorModel')
const BlogModel = require('../model/BlogModel')




// This is the second Api where we can create a blog 


const createBlog = async function (req, res) { 
    let data = req.body
    let condition = await authorModel.findById(data.authorId)
    if (condition) {
        if (data.isPublished == true) {
            data.publishedAt = Date.now()
            let savedData = await BlogModel.create(data)

            res.status(201).send({ msg: savedData })

        }
        else  {
            let savedData = await BlogModel.create(data)
            res.status(201).send({ msg: savedData })
        }

    } else {
        res.status(400).send({ status: false, msg: "authorId is not present" })
    }
}
module.exports.createBlog=createBlog
// this is the 3rd api//
const getBlog = async function (req, res) { 
    let data = req.query



    let getData = await BlogModel.find({ $and: [{ isDeleted: false }, { isPublished: true },data ] }).populate('authorId')
    console.log(getData);

    if (getData.length === 0) {
        return res.status(400).send({ status: false, error: "Page not found",msg:"EITHER DELETED OR NOT PUBLISHED" })
    }

    res.status(200).send({ status: true, data: getData })


}
module.exports.getBlog=getBlog

/// this is the 4th api //



const updateBlog = async function (req, res) {
    try { 
        let getId = req.params.blogId
        let data = req.body  
        let checkId = await BlogModel.findOne({ _id: getId })
        console.log(checkId)
        if (checkId) {
            if (checkId.isDeleted === false) {
                let check = await BlogModel.findByIdAndUpdate(getId, { $push: { tags: data.tags, subcategory: data.subcategory }, title: data.title, body: data.body, category: data.category }, { new: true })
                res.status(200).send({ status: true, msg: check })
            }
            else {
                res.send("CANT UPDATE , IT IS DELETED")
            }
        }
        else {
            res.status(401).send({ status: false, msg: "Please enter valid Blog id" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
}

module.exports.updateBlog=updateBlog

// this is the 5th api //
const deleteBlog = async function (req, res) {
    let blogId = req.params.blogId

    if (!blogId) { return res.status(404).send("KINDLY ADD BLOG ID") }
    let blog = await BlogModel.findById(blogId)

    if (!blog) { return res.status(404).send("NOT A VALID BLOG ID") }
    if (blog.isDeleted == false) {
        let save = await BlogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

        return res.status(200).send({ msg: save })
    } else {
        res.status(404).send({ status: false, msg: "already deleted" })
    }
}
module.exports.deleteBlog=deleteBlog

//this is the 6th api 
const deletebyquery = async function (req, res) {
   let data = req.query
    
    console.log(data)
    let find = await BlogModel.findOne(data)
    console.log(find)
    if (!find) { return res.status(404).send({ status: false, msg: "Blog is not created" }) }
    if(find.isDeleted==true){return res.status(400).send({status:false,msg:"THIS DOCUMENT Is deleted"})}
    let saved = await BlogModel.findOneAndUpdate( data ,{ $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
    res.status(200).send({ status: true, msg: saved })

}
module.exports.deletebyquery=deletebyquery

