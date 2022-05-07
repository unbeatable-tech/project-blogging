let authorModel = require("../models/authormodel");
let BlogModel = require("../models/Blogmodel");
const mongoose = require("mongoose");

(objectId) =>mongoose.Types.ObjectId.isValid(objectId)

const isValidObjectId = (objectId) => { return mongoose.Types.ObjectId.isValid(objectId)};


const createBlog = async function (req, res) {
  try {
    let data = req.body;
    //console.log(isValidObjectId(data.authorId))
    let decodedtoken= req.decodedtoken
    //VALIDATION
    if(!data.title)return res.status(400).send({status :false , msg:" PLEASE ENTER TITLE"})
    if(!data.body)return res.status(400).send({status :false , msg:" PLEASE ENTER BODY"})
    if(!data.category)return res.status(400).send({status :false , msg:" PLEASE ENTER CATEGORY"})
    if(!data.authorId) return res.status(400).send({status :false , msg:" PLEASE ENTER AUTHOR ID"})
    if (!isValidObjectId(data.authorId)) {
      return res.status(400).send("NOT A VALID AUTHOR ID");
    }
    if(decodedtoken.authorId !== data.authorId) return res.status(400).send({status:false,msg : "YOU ARE NOT AUTHORIZED TO CREATE BLOG WITH THIS AUTHOR ID"})


    //LOGIC
    let condition = await authorModel.findById(data.authorId);
    if (condition) {
      if(data.isDeleted==true){return res.status(400).send({status:false,msg:"Cant delete without creation"})}
      if (data.isPublished == true) {
        data.publishedAt = Date.now();
        
        let savedData = await BlogModel.create(data);
        res.status(201).send({ status: true,data: savedData });
      } else {
        let savedData = await BlogModel.create(data);
        res.status(201).send({ status: true,data: savedData });
      }
    } else {
      res.status(400).send({ status: false, msg: "authorId is not present" });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    //console.log(data)
    let getData = await BlogModel.find({
      $and: [{ isDeleted: false }, { isPublished: true }, data]
    }).populate("authorId");

    if (getData.length === 0) {
      return res.status(400).send({
        status: false,
        msg: "EITHER DELETED OR NOT PUBLISHED", 
      });
    }

    res.status(200).send({ status: true, data: getData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//3rd update data api
const updateBlog = async function (req, res) {
  try {

    let getId = req.params.blogId;
    let data = req.body;  
 
    let checkId = await BlogModel.findById(getId); //wa can use findOne also
    if (checkId) {
      if (checkId.isDeleted === false) {
        
        
        let check = await BlogModel.findByIdAndUpdate(//filer,update
          getId,
          {
            $push: { tags:data.tags, subcategory:data.subcategory},
            title: data.title,
            body: data.body,
            category: data.category,
            isPublished: true,
            publishedAt: Date.now(),
          },
          { new: true }
        );
       
        let a = check.tags.flat(); //[one,[two,three]] = [one,two,three]
        let b = check.subcategory.flat();
        
        let updateSecondTime = await BlogModel.findByIdAndUpdate(
          getId,
          {
            tags: a,
            subcategory: b,
          },
          { new: true }
        );


        res.status(200).send({ status: true, data: updateSecondTime });
      } else {
        res
          .status(400)
          .send({ status: false, msg: "CANT UPDATE , IT IS DELETED" });
      }
    } else {
      res
        .status(400)
        .send({ status: false, msg: "Please enter valid Blog id" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//delete
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;

    let blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send("NOT A VALID BLOG ID");
    }
    if (blog.isDeleted == false) {
      let save = await BlogModel.findOneAndUpdate(
        { _id: blogId },
        {
          $set: { isDeleted: true, deletedAt: Date.now() },
        },
        { new: true }
      );

      return res.status(200).send({status:true, msg : "BLOG IS  DELETED" }); //cmd on sunday
    } else {
      res.status(404).send({ status: false, msg: "AlREADY DELETED" });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//delet by query
const deletebyquery = async function (req, res) {
  try {
    let data = req.query;
    //catched data
    if (Object.keys(data).length == 0) {
            //-> if data undefined
            return res.status(400).send({
                status: false,
                msg: "MUST BE ANY QUERY"
            })};
     let decodedtoken=req.decodedtoken;
    

    let findblog = await BlogModel.find({
      $and: [ { authorId: decodedtoken.authorId },data],//
    });
    if (findblog.length == 0)
      return res.send({ status: false, msg: "NO CRITERIA MATCHES" });
   
      
      let allblog = await BlogModel.updateMany(
        {
          $and: [
            data,
            { authorId: decodedtoken.authorId },
            { isDeleted: false },
          ],
        },
        { isDeleted: true, deletedAt: Date.now() }
      );

      if (allblog.modifiedCount == 0) {
        return res.status(400).send({ status: false, msg: "ALREADY DELETED" });
      } else res.status(200).send({  status: true, data:  `${allblog.modifiedCount}-DELETED` });
    } 
    
   catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletebyquery };