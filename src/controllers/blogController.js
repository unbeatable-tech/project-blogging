let authorModel = require("../models/authormodel");
let BlogModel = require("../models/Blogmodel");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Blogmodel = require("../models/Blogmodel");
const isValidObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);


// third api to create blog
const createBlog = async function (req, res) {
  try {
    let data = req.body
   

    if (data.title && data.body && data.authorId && data.category) {

      if (!data.isPublished) {
        let blogData = await Blogmodel.create(data);
        return res.status(201).send({ status: true, data: blogData });
      } else {
        data.publishedAt = new Date();
        let blogData = await Blogmodel.create(data);
        return res.status(201).send({ status: true, data: blogData });
      }

    } else {
      return res.status(400).send({ status: false, msg: "Required field missing" });
    }
  }

  catch (error) {
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }

}
// fourth api to get blog
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

    const blogs = await Blogmodel.find(filter);
    if (blogs.length > 0) {
        return res.status(200).send({ status: true, data: blogs });
    } else {
        return res.status(400).send({ status: false, msg: "not found" });
    }
}catch (error) {
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};

//fifth api to  update data 
const updateBlog = async function (req, res) {
  try {


    let getId = req.params.blogId;
    let data = req.body;
    console.log(data)
    let checkId = await BlogModel.findById(getId);
    if (checkId) {
      if (checkId.isDeleted === false) {


        let check = await BlogModel.findByIdAndUpdate(
          getId,
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

        let a = check.tags.flat();
        let b = check.subcategory.flat();
        console.log(a);
        let check2 = await BlogModel.findByIdAndUpdate(
          getId,
          {
            tags: a,
            subcategory: b,
          },
          { new: true }
        );


        res.status(200).send({ status: true, msg: check2 });
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
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};

//sixth api delete by id
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId) {
      return res.status(404).send("KINDLY ADD BLOG ID");
    }
    let blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send("NOT A VALID BLOG ID");
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
      res.status(404).send({ status: false, msg: "already deleted" });
    }
  } catch (error) {
    console.log("This is the error :", error)
    res.status(500).send({ msg: "Error", error: error.message })
  }
};

const deletebyquery = async function (req, res) {
  try {
    data = req.query; 

     let decodedtoken=req.decodedtoken;
    

    let findblog = await BlogModel.find({
      $and: [data, { authorId: decodedtoken.authorId }],
    });
    if (findblog.length == 0)
      return res.send({ status: false, msg: "YOU ARE NOT AUTHORISED" });
    
      let allblog = await BlogModel.updateMany(
        {
          $and: [
            data,
            { authorId: decodedtoken.authorId },
            { isDeleted: false },
          ],
        },
        {$set :{isDeleted: true, deletedAt: Date.now()} }
      );

      if (allblog.modifiedCount == 0) {
        return res.status(400).send({ status: false, msg: "Already deleted" });
      } else res.status(200).send({ status: true, data: `(${allblog.modifiedCount}`==1  ? `${allblog.modifiedCount}-BLOG DELETED` : `${allblog.modifiedCount}-BLOGS DELETED` });
    
     } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};
module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletebyquery };