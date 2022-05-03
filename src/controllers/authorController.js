const authormodel = require('../models/authormodel')
const jwt = require('jsonwebtoken')

// first api to create author
let createauthor = async function (req, res) {
    try {
        let check = req.body


        let emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

        // VALIDATION


        if (!check.fname) { return res.status(400).send({ status: false, msg: "pls enter fisrt name" }) }
        if (!check.lname) { return res.status(400).send({ status: false, msg: "pls enter last name " }) }
        if (!check.title) { return res.status(400).send({ status: false, msg: " pls enter title" }) }
        if (!check.email) { return res.status(400).send({ status: false, msg: "pls enter email" }) }
        if (!check.password) { return res.status(400).send({ status: false, msg: "pls enter passowrd" }) }

        // REGEX VALIDATION


        if (!check.email.match(emailregex))
            return res.status(400).send({ status: false, msg: "Email is not Valid" })
        let duplicate = await authormodel.findOne({ email: check.email })
        if (duplicate) {
            return res.status(400).send({ status: false, msg: "email already exist" })
        }
        //LOGIC
        let save = await authormodel.create(check)
        res.status(200).send({ msg: save })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

// second api to create login 

const login = async function (req, res) {
    let check=req.body
    let email = req.body.email
    let password = req.body.password
    let emailregex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

    /*********************validation************************ */
    if (!email) { return res.status(400).send({ status: false, msg: "Add Email id" }) }

    if (!check.email.match(emailregex))
        return res.status(400).send({ status: false, msg: "Email is not Valid" })

    if (!password) { return res.status(400).send({ status: false, msg: "Add Password" }) }

    /******************validation ends*************/

    let get = await authormodel.findOne({ email: email, password: password })
    if (!get) { return res.status(400).send({ status: false, msg: "your email and password is incorrect" }) }
    let token = jwt.sign({ authorId: get._id.toString() }, "Group-14")
    res.setHeader("x-api-key", token)
    res.status(200).send({ status: true, msg: "you are successfully logged in", data: token })
}




module.exports.createauthor = createauthor
module.exports.login = login 