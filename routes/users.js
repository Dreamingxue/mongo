var express = require('express');
var router = express.Router();
var path=require('path');
var User=require(path.join(__dirname,'../model/user.js'))

var Message=require(path.join(__dirname,'../public/javascripts/alertMessage.js'))
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login',(req,res)=>{
	res.render('users/login')
})
router.post('/login',(req,res)=>{
	if(req.body['name']&&req.body['password']){
		var name=req.body.name;
		var password=req.body.password;
		User.findOne({name:name}).then((data)=>{
			if(data){
				if(password==data.password){
					res.cookie('username',data.name)
					/*res.render('message/errorMessage.html',{
						urlPath:'/',
						message:'登录成功'
					})*/
					Message.showRight('/','登录成功',res)
				}else{
					Message.showError('密码错误，请重新输入',res)
					/*res.render('message/errorMessage.html',{
						urlPath:'/users/login',
						message:'密码错误，请重新输入'
					})*/
				}
			}else{
				res.render('message/errorMessage.html',{
					urlPath:'/users/login',
					message:'用户名错误，请重新输入'
				})
			}
		},(err)=>{
			res.render('message/errorMessage.html',{
				urlPath:'/users/login',
				message:'服务器错误'
			})
		})
	}else{
		res.render("message/errorMessage.html",{
			urlPath:'/users/login',
			message:'服务器错误'
		})
	}
})
router.get('/regist',(req,res)=>{
	res.render('users/regist')
})
router.post('/regist',(req,res)=>{
	if (req.body['name']&&req.body['password']&&req.body['email']) {
		var name=req.body.name;
		User.findOne({name:name}).then((data)=>{
			if(data){
				res.render('message/errorMessage.html',{
					urlPath:'/users/regist',
					message:'用户名重复，请重新注册'
				});
			}else{
				console.log('isAdmin:',req.body.isAdmin)
				
				req.body.isAdmin = req.body.isAdmin?true:false
				//判断用户名是否是admin
				if(req.body.name=="admin"){
					req.body.isAdmin = true;
				}
				User.create(req.body,(err,data)=>{
					if(err){
						res.render('message/errorMessage.html',{
							urlPath:'/users/regist',
							message:'服务器错误'
						})
					}else{
						if(data){
							//console.log(data)
							// 需要保存用户的信息 然后在另一个页面使用
							// cookie 小甜饼 存储在浏览器端的
						// 存储到cookie中
							res.cookie('username',data.name)
							
							res.render('message/errorMessage.html',{
								urlPath:'/',
								message:'注册成功，跳转主页'
							})
						}else{
							res.render('message/errorMessage.html',{
								urlPath:'/users/regist',
								message:'用户名不能为空，请填写用户名'
							})
						}
					}
				})
			}
		},(err)=>{
			res.render('message/errorMessage.html',{
				urlPath:'/users/regist',
				message:'服务器错误'
			})
		})
	}else{
		res.render("message/errorMessage.html",{
			urlPath:'/users/regist',
			message:'服务器错误'
		})
	}
})
//退出登录
router.get('/loginout',(req,res)=>{
	//清除cookie
	res.clearCookie("username")
	res.redirect('/')
})
module.exports = router;

