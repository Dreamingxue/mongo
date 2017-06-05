function showError(message,res) {
	var result=`<script>alert("${message}");history.back()</script>`
	res.send(result)
}
function showRight(urlPath,message,res) {
	res.render('message/errorMessage.html',{
		urlPath,
		message
	})
}
module.exports={showError,showRight}