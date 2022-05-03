const req = require("express/lib/request");
const authormodel = require("../models/authormodel");
const Blogmodel = require("../models/Blogmodel");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  
  
  let token = req.headers["x-api-key"];
  if (!token) {
    return res.status(400).send({ status: false, msg: "please add token" });
  }
  let decodedtoken = jwt.verify(token, "Group-14",);

 
  req.decodedtoken = decodedtoken;

  next();
};

const authorize = async function (req, res, next) {
  let blogId = req.params.blogId;
  let get = await Blogmodel.findById(blogId).select({ authorId: 1, _id: 0 });
  if(!get){return res.status(400).send({ status: false, msg: "Please enter valid Blog id" });}

 
  
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