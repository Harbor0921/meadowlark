var app = require('express')();
app.use(function(req,res,next){
	console.log('\n\nALLWAYS');
	next();
});
app.get('/a',function(req,res){
	console.log('/a:route teminating');
	res.send('a');
});
app.get('/a',function(req,res){
	console.log('/a: never called');
});
app.get('/b',function(req,res,next){
	console.log('/b: route not end.');
	next();
});
app.use(function(req,res,next){
	console.log('SOMETIMES');
	next();
});
app.get('/b',function(req,res,next){
	console.log('b(part2): throw exception(err)');
	throw new Error('B failed!');
});
app.use('/b',function(err,req,res,next){
	console.log('b tested err and resend!');
	next(err);
});
app.get('/c',function(err,req){
	console.log('/c:throw err');
	throw new Error('c failed!');
});
app.use('/c',function(err,req,res,next){
	console.log('b tested err but not send!');
	next();
});
app.use(function(err,req,res,next){
	console.log('the not deal err found. err msg:'+err.message);
	res.send('500 - Server Error');
});
app.use(function(req,res){
	console.log('not deals route');
	res.send('404 - route not found');
});
app.listen(3000,function(){
	console.log('listen 3000 port');
})