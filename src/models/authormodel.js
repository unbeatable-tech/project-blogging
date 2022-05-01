const mongoose = require('mongoose')

const validator = require('validator')




const AuthorSchema = new mongoose.Schema({
	fName: { type: String, required: true,trim :true },
	lName: { type: String, required: true,trim :true },
	title: {
		type: String, required: true,
		enum: ["Mr", "Mrs", "Miss"]
	},
	email: {
		type: String,
		unique: true,
		required : true},
	
	password: { type: String, required: true }

})

module.exports = mongoose.model('Author', AuthorSchema)

