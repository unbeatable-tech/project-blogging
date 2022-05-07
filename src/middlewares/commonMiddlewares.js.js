const req = require("express/lib/request");
const authormodel = require("../models/authormodel");
const Blogmodel = require("../models/Blogmodel");
const mongoose = require("mongoose");
const isValidObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);
const jwt = require("jsonwebtoken");

const auth1 = async function (req, res, next) {
  
  try{
  let token = req.headers["X-api-key"];
  if(!token) token = req.headers["x-api-key"]
  if (!token) {
    return res.status(400).send({ status: false, msg: "KINDLY ADD TOKEN" });
  }
  
  const decodedtoken = jwt.verify(token, "GROUP14");
  
  //console.log(decodedtoken)
  //res.locals.decodedtoken = JSON.stringify(decodedtoken);
  req.decodedtoken = decodedtoken;

  next();
}catch(error){
  res.status(403).send({status: false,msg:"INVALID SIGNATURE"})
}};

const auth2 = async function (req, res, next) {
  let blogId = req.params.blogId;
  let get = await Blogmodel.findById(blogId).select({ authorId: 1, _id: 0 });
  if(!get){return res.status(400).send({ status: false, msg: "Please enter valid Blog id" });}
  
  let token = req.headers["X-api-key"]
  if(!token) token = req.headers["x-api-key"]
  if (!token) {
    return res.status(400).send({ status: false, msg: "KINDLY ADD TOKEN" });
  }
  let decodedtoken = jwt.verify(token, "GROUP14");
  if (decodedtoken.authorId != get.authorId) {
    return res.status(403).send({ status: false, msg: "NOT AUTHORISED" });
  }
  next();
};
module.exports = { auth1, auth2 };