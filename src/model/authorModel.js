const mongoose = require('mongoose')
const validator = require('validator')

const authorSchema = new mongoose.Schema({



    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {

        type: String,
        required: true,
        trim: true
    },

    title: {

        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email");
            }
        }




    },


    password: {


        type: String,
        required: true,

        trim: true
    },











}, { timestamps: true });


module.exports = mongoose.model("Author", authorSchema)