var express=require('express');
var router=express.Router();
var path=require('path')
var Book=require(path.join(__dirname,'../model/book.js'))
var multer=require('multer')
var upload=multer({dest:'public/images/'})
var Message=require(path.join(__dirname,'../public/javascripts/alertMessage.js'))

var fs=require('fs');


router.get('/shops',(req,res,next)=>{
	var books=null;
	var page=req.query.page||1;
	//每页显示的商品数量
	var countPage=10;
	Book.count().then((aCount)=>{

		Book.find({}).skip((page-1)*countPage).limit(countPage).sort({_id:-1}).then((data)=>{
			books=data;
			res.render('shops/index',{
				books,
				username:req.cookies.username,
				sumPage:Math.ceil(aCount/countPage),
				currentPage:page
			})
		},(err)=>{
			next()
		})

	},(err)=>{
		Message.showError('数据查找失败',res)
	})
	
	
})


//添加商品页
router.get('/shops/insert',(req,res)=>{
	res.render('shops/insert',{
		username:req.cookies.username
	})
})
router.post('/shops/insert',upload.single('image'),(req,res)=>{
	//判断字段是否存在
	console.log(req.body)
	//console.log('file:',req.file)
	if(req.file){
		var exthname=path.extname(req.file.originalname)
		//console.log(exthname)
		var oldPath='public/images/'+req.file.filename;
		var newPath='public/images/'+req.file.filename+exthname
		fs.rename(oldPath,newPath,(err,data)=>{
			if(err){
				res.render('message/errorMessage.html',{
					urlPath:'/shops/insert',
					message:'上传成功，修改失败'
				})
			}else{
				req.body.img=req.file.filename+exthname;
				Book.create(req.body).then((data)=>{
					if(data){
						res.render('message/errorMessage.html',{
							urlPath:'/shops/insert',
							message:'数据存储成功'
						})
					}else{
						res.render('message/errorMessage.html',{
							urlPath:'/shops/insert',
							message:'数据存储失败'
						})
					}
				},(err)=>{
					res.render('message/errorMessage.html',{
						urlPath:'/shops/insert',
						message:'数据存储失败'
					})
				})
			}
		})
	}else{

	}

})

//修改页面渲染
router.get('/shops/update/:id',(req,res)=>{
	console.log(req.params.id)
	Book.findById(req.params.id).then((data)=>{
		res.render('shops/update',{
			book:data,
			username:req.cookies.username
		})
		//res.send('111')
	},(err)=>{
		res.render('message/errorMessage.html',{
			urlPath:'/shops/insert',
			message:'没有找到对应商品'
		})
	})
})
//需要判断是否提交图片，提交和不提交两种情况
//单张上传
router.post('/shops/update/:id',upload.single('image'),(req,res)=>{
	if(req.file){
		var exthname=path.extname(req.file.originalname)
		//console.log(exthname)
		var oldPath='public/images/'+req.file.filename;
		var newPath='public/images/'+req.file.filename+exthname
		fs.rename(oldPath,newPath,(err,data)=>{
			if(err){
				fs.unlink(oldPath);
				res.render("message/errorMessage",{
					urlPath:"/shops/",
					message:"图片上传成功修改失败"
				})
			}else{
				var originalname=req.body.img;
				req.body.img=req.file.filename+exthname;
				Book.update({_id:req.body.id},{$set:req.body}).then((data)=>{
					if(data){
						fs.unlink("public/images/"+originalname);
						res.render("message/errorMessage",{
								urlPath:"/shops/",
								message:"商品信息修改成功"
						})
					}
				},(err)=>{
					fs.unlink("public/images/"+req.body.img);
					res.render("message/errorMessage",{
							urlPath:"/shops/update",
							message:"商品信息修改失败,请重试"
					})
				})
			}
		})
	}else{
		//没有修改图片,只修改图片
		Book.update({_id:req.body.id},{$set:req.body}).then((data)=>{
			res.render('message/errorMessage.html',{
				urlPath:'/shops',
				message:'修改成功'
			})
		},(err)=>{
			fs.unlink("public/images/"+req.body.img);
			res.render('message/errorMessage.html',{
				urlPath:'/shops/update',
				message:'数据修改失败'
			})
		})
	}
})
//后台商品删除
router.get('/shops/remove/:id/:imgname',(req,res)=>{
	Book.remove({_id:req.params.id}).then((data)=>{
		if(data){
			fs.unlink('public/images'+req.params.imgname);
			/*res.render('message/errorMessage.html',{
				urlPath:'/shops',
				message:'删除成功'
			})*/
			res.redirect('/shops')
		}else{
			res.render('message/errorMessage.html',{
				urlPath:'/shops',
				message:'删除条件不存在'
			})
		}
	},(err)=>{
		res.render('message/errorMessage.html',{
			urlPath:'/shops',
			message:'删除失败'
		})
	})
})
module.exports=router