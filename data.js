var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/book');
var db=mongoose.connection;
db.on('error',()=>{
	console.log('数据库启动失败')
})
db.once('open',()=>{
	console.log('数据库启动成功')
	var bookSchema=mongoose.Schema({
		id:String,
		title:String,
		price:Number,
		pudate:String,
		status:String,
		cateid:String,
		images:[
			{
				image_id:String,
				image_name:String,
				book_id:String
			}
		]
	})
	var Book=mongoose.model('Book',bookSchema)
	Book.create().then((data)=>{
		console.log('导入数据成功')
	},(err)=>{
		console.log('导入数据失败')
	})
})