var express=require('express');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/glob');
var db=mongoose.connection;
db.on('error',()=>{
  console.log('数据库开启失败');
})
db.once('open',()=>{
   console.log('数据库开启成功');
   var Book=mongoose.model('Book',{
   	title:String,
   	price:Number,
   	num:Number,
   	img:String
   })
   for(var i=0;i<34;i++){
   		Book.create({
   			title:'html5'+(i+1),
   			price:10*i,
   			num:1234+i,
   			img:i+1+".jpg"
   		},(err,data)=>{
   			if(err){
   				console.log('创建失败')
   			}else{

   				console.log('创建成功')
   			}
   		})
   }
})