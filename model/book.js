var mongoose=require('mongoose');
var Book=mongoose.model('Book',{
	title:String,
	price:Number,
	num:Number,
	img:String
})
module.exports=Book;