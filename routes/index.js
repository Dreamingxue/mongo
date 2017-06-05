var express = require('express');
var router = express.Router();
var path=require('path')
var Book=require(path.join(__dirname,'../model/book.js'))
var User=require(path.join(__dirname,'../model/user.js'))
var Cart=require(path.join(__dirname,'../model/carts.js'))
//var Message=require(path.join(__dirname,'../message/errorMessage.html'))

/* GET home page. */
router.get('/', function(req, res, next) {
	var books=null;
	//需要查询刚才插入的数据
	//需要获取传递的page参数，默认是第一项
	var page=req.query.page||1;
	//console.log("page:",page)
	//如果第一次访问默认就是访问第一页数据
	//每页显示的数据
	var PageCount=5
	Book.count().then((aCount)=>{
		//console.log('yeshu:',Math.ceil(aCount/PageCount))
		//进行数据分页
		Book.find({}).skip((PageCount-1)*page).limit(PageCount).sort({_id:-1}).then((data)=>{
			books=data;
			//console.log(data)
			var username=null;

			//console.log('=----------------------------------',req.query)
			if(req.query.id&&req.query.username){
				//console.log('-----------',req.query.id)
				Cart.findOne({userid:req.query.username,bookid:req.query.id}).then((data)=>{
					//console.log('--------------',data)
					if(data){
						Cart.update({userid:req.query.username,bookid:req.query.id},{num:data.num+1}).then((data)=>{
							//console.log('------------',data)
						})
						//data.num+=1;
					}else{
						Cart.create({userid:req.query.username,bookid:req.query.id,num:1}).then((data)=>{
							//console.log('111111111')
						},(err)=>{

						})
					}
				},(err)=>{

				})
			}else{
				//Message.showError('/','请先登录再添加到购物车')
			
			}

			//读取cookie
			if(req.cookies.username){
				username=req.cookies.username;

				//查询该用户是否是管理员
				User.findOne({name:username}).then((data)=>{
					if(data.name=='admin'){
						res.render('index',{
							isAdmin:data.isAdmin,
							username,
							books,
							currentPage:page,
							booksPage:Math.ceil(aCount/PageCount)
						})
					}else{
						res.render('index',{
							isAdmin:false,
							username,
							books,
							currentPage:page,
							booksPage:Math.ceil(aCount/PageCount)
						})
					}
				},(err)=>{
					res.render('index',{
						isAdmin:false,
						username,
						books,
						currentPage:page,
						booksPage:Math.ceil(aCount/PageCount)
					})
				})
		}else{
			res.render('index',{
				isAdmin:false,
				username,
				books,
				currentPage:page,
				booksPage:Math.ceil(aCount/PageCount)
			})
		}

			//res.render('index', {username,books});
		},(err)=>{
			console.log('查找失败')
		})
	},(err)=>{

	})
	
  	
});
//商品详情页
router.get('/detail/:id',(req,res,next)=>{
	Book.findById(req.params.id).then((data)=>{
		res.render('users/detail',{data})
	},(err)=>{
		//next()
	})
	
})

//将商品添加到购物车
router.get('/shoppingCart',(req,res)=>{
	
	var page=req.query.page||1;
	var PageCount=5
	//存放book数据库信息
	var cart=[];
	//存放购物车信息
	var carts=[]
	//存放购物车商品价格
	var total = [];
	//定义一个购物车商品总价变量
	var sumprice=null;
	var username=req.cookies.username;
	Cart.count().then((aCount)=>{
		Cart.find({userid:username}).skip((page-1)*PageCount).limit(PageCount).sort({_id:-1}).then((data)=>{
		//判断添加数量，用到carts[0](因为data是数组)中的num属性
		carts.push(data);
		//定义一个空的变量存放商品的价格和数量
		
		//找到购物车商品对应的id,添加到新的数组，因为页面渲染使用books的数据信息

		for(var i=0;i<data.length;i++){
			//num=data[i].num;
			Book.findOne({_id:data[i].bookid}).then((data)=>{
				cart.push(data);

				//price=data.price;
			},(err)=>{

			})
		}
		/*for(let i=0;i<carts[0].length;i++){
			cartsshop =carts[0][i];
			cartsshop.book=cart[i]

		}
		console.log('cartsshop ---------------',cartsshop )
		console.log('cart-----',cart);
		console.log('carts[0]------------',carts[0])*/
		setInterval(function (){
			
			if(cart.length==data.length){
				
				for(var i=0;i<carts[0].length;i++){
					//把商品价格放到数组里面
					var num=carts[0][i].num*cart[i].price
					total.push(num);
					
				}
				console.log('test1-------',total)
				for(var i=0;i<total.length;i++){
					sumprice+=total[i]
				}

				console.log('length....-----',sumprice);
				//console.log('cart-----',cart);
				console.log('carts[0]------------',carts[0].length)
				res.render('cart/shoppingCart',{
					username:req.cookies.username,
					books:cart,
					carts:carts[0],
					currentPage:page,
					sumPage:Math.ceil(aCount/PageCount),
					total: total,
					sumprice:sumprice
				})
			}
		},50)

	},(err)=>{

	})
})
	},(err)=>{

	})
	

//购物车商品删除
router.get('/shoppingCart/:id',(req,res)=>{

	//console.log('----------------',req.params.id)

	Cart.find({bookid:req.params.id}).then((data)=>{
		if(data){
			console.log('-----------',data)
			if(data[0].num>1){
				Cart.update(data[0],{$set:{num:data[0].num-1}}).then((data)=>{

				},(err)=>{

				})
			}else{
				Cart.remove(data[0]).then((data)=>{
					
				},(err)=>{
					
				})
			}
			
		}else{
			res.send('error')
		}
		res.redirect('/shoppingCart')
			
	},(err)=>{
		res.send('error11')
	})
	
})

module.exports = router;
