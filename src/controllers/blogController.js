let authorModel = require("../models/authormodel");
let BlogModel = require("../models/Blogmodel");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");




//third api to create blog
const createBlog = async function (req, res) {
  try {
    let data=req.body
   
    let decodedtoken= req.decodedtoken
    //VALIDATION
    if(!data.title)return res.status(400).send({status :false , msg:" PLEASE ENTER TITLE"})
    if(!data.body)return res.status(400).send({status :false, msg:" PLEASE ENTER BODY"})
    if(!data.category)return res.status(400).send({status :false , msg:" PLEASE ENTER CATEGORY"})
    if(!data.authorId) return res.status(400).send({status :false , msg:" PLEASE ENTER AUTHOR ID"})
    
    if(decodedtoken.authorId !== data.authorId) return res.status(400).send({status:false,msg : "YOU ARE NOT AUTHORIZED TO CREATE BLOG WITH THIS AUTHOR ID"})


    //LOGIC
    let condition = await authorModel.findById(data.authorId);
    if (condition) {
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

     
//fourth api to get blog

const getBlog = async function (req, res) {
  try {
    let filter = {
        isDeleted: false,
        isPublished: true
    };
    if (req.query.authorId) {
        filter["authorId"] = req.query.authorId;
    }
    if (req.query.category) {
        filter["category"] = req.query.category;
    }
    if (req.query.tags) {
        filter["tags"] = req.query.tags;
    }
    if (req.query.subcategory) {
        filter["subcategory"] = req.query.subcategory;
    }

    const blogs = await BlogModel.find(filter);
    if (blogs.length > 0) {
        return res.status(200).send({ status: true, data: blogs });
    } else {
        return res.status(400).send({ status: false, msg: "No such blog is found!" });
    }
}catch (error) {
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};
//fifth api to update blog
 
const updateBlog = async function (req, res) {
  try {


    let get = req.params.blogId;
    let data = req.body;
    console.log(data)
    let find = await BlogModel.findById(get);
    if (find) {
      if (find.isDeleted === false) {


        let find1 = await BlogModel.findByIdAndUpdate(
          get,
          {
            $push: { tags: data.tags, subcategory: data.subcategory },
            title: data.title,
            body: data.body,
            category: data.category,
            isPublished: true,
            publishedAt: Date.now(),
          },
          { new: true }
        );

        let a = find1.tags.flat();
        let b = find1.subcategory.flat();
        console.log(a);
        let find2 = await BlogModel.findByIdAndUpdate(
          get,
          {
            tags: a,
            subcategory: b,
          },
          { new: true }
        );


        res.status(200).send({ status: true, msg: find2 });
      } else {
        res
          .status(400)
          .send({ status: false, msg: "Deleted already " });
      }
    } else {
      res
        .status(400)
        .send({ status: false, msg: "Please add valid Blog id" });
    }
  } catch (error) {
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};



//sixth api to delete blog by id

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId) {
      return res.status(404).send("please add Blog id");
    }
    let blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send("please add valid BlogId");
    }
    if (blog.isDeleted == false) {
      let save = await BlogModel.findOneAndUpdate(
        { _id: blogId },
        {
          $set: { isDeleted: true, deletedAt: Date.now(), isPublished: false },
        },
        { new: true }
      );

      return res.status(200).send({ msg: save });
    } else {
      res.status(404).send({ status: false, msg: "Already Deleted Blog Document" });
    }
  }
 catch (error) {
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};

//seventh api to delete blog by query params 
 

const deletebyquery = async function (req, res) {
  try {
    data = req.query; 

     let decodedtoken=req.decodedtoken;
     if(Object.keys(data).length == 0)
     return res.status(400).send({status:false,msg:"Please add queries"})
     data.isDeleted = false;
    

    let blog = await BlogModel.find({
       data,  authorId: decodedtoken.authorId 
    });
    if (blog.length == 0)
      return res.status(403).send({ status: false, msg: "you are not authorized" });
    
      let check = await BlogModel.updateMany(
        
          
        {
          $and: [
            data,
            { authorId: decodedtoken.authorId },
            { isDeleted: false },
          ],
        },
          
        
       { $set :{isDeleted: true, deletedAt: Date.now()} }
      );
      console.log(check)

      if (check.modifiedCount == 0) {
        return res.status(400).send({ status: false, msg: "No such blog exist" });
      } else res.status(200).send({ status: true, data:'Blog has been Deleted' });
    
     } catch (error) {
      console.log("This is the error :", error)
      res.status(500).send({ msg: "Error", error: error.message })
    }
  
};

module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletebyquery };