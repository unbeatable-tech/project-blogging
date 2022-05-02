const req = require("express/lib/request");
const authormodel = require("../models/authormodel");
const Blogmodel = require("../models/Blogmodel");
const mongoose = require("mongoose");
const isValidObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);
const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  
  
  let token = req.headers["x-api-key"];
  if (!token) {
    return res.status(400).send({ status: false, msg: "please add token" });
  }
  let decodedtoken = jwt.verify(token, "Group-14");

  if(!decodedtoken){
    return res.status(401).send({status:false,msg:"Authentication failed"})
  }
  req.decodedtoken = decodedtoken;

  next();
};

const authorize = async function (req, res, next) {
  let blogId = req.params.blogId;
  let get = await Blogmodel.findById(blogId).select({ authorId: 1, _id: 0 });
  if(!get){return res.status(400).send({ status: false, msg: "Please enter valid Blog id" });}

  if(get.isDeleted==true){
    return res.status(404).send({status:false,msg:"NO such blog found or Blog is already deleted"})
  }
  
  let token = req.headers["x-api-key"];
  if (!token) {
    return res.status(400).send({ status: false, msg: "KINDLY ADD TOKEN" });
  }
  let decodedtoken = jwt.verify(token, "Group-14");
  if (decodedtoken.authorId != get.authorId) {
    return res.status(403).send({ status: false, msg: "unauthorize acess" });
  }
  next();
};
module.exports = { authentication, authorize };