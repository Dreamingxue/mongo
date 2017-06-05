var mongoose = require("mongoose");

var Cart = mongoose.model("Cart",{
         userid:String,
         bookid:String,
         num:Number
       });

module.exports = Cart;