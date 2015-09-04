
var express = require('express');

var fortune = require('./lib/fortunes.js');

var app = express();

var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(express.static(__dirname + '/public'));

app.set('port',process.env.PORT || 3000);

app.get('/',function(req,res){
	res.render('home'); 
});

app.get('/about',function(req,res){
        //var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];

		//res.render('about',{fortune : randomFortune}); 
		res.render('about',{ fortune : fortune.getFortunes() } );
});
//cha8.5 form
app.use(require('body-parser')());

app.get('/newsletter',function(req,res){
  res.render('newsletter',{csrf:'CSRF token goes here'});
});

app.post('/process',function(req,res){
  console.log('Form (form querystring): '+ req.query.form);
  console.log('CSRF token (form hidden form field): '+req.body._csrf);
  console.log('Name (form visiable form field): '+req.body.name);
  console.log('Email (form visiable form field): '+req.body.email);
  if(req.xhr || req.accepts('json,html')==='json'){
    //如过发生错误应该发送{error:'error description'}
    console.log('res:send success');
    res.send({success:true});
  }else{
    //如过发生错误应重定向到错误页面
    console.log('res:send err');
    res.redirect(303,'/thank-you');
  }
});

//8.7 formidable data upload
var formidable = require('formidable');

app.get('/contest/vacation-photo',function(req,res){
  var now = new Date();
  res.render('contest/vacation-photo',{
    year:now.getFullYear(),month:now.getMonth()
  });
});

app.post('/contest/vacation-photo/:year/:month',function(req,res){
  var form = new formidable.IncomingForm();
  form.parse(req,function(err,fields,files){
    if(err) return res.redirect(303,'/error');
    console.log('received fields: '+fields);
    console.log('received files： '+files);
    res.redirect(303,'thank-you');
  });
});


app.use(function(req,res,next){
   res.status(404);
   res.render('404');
});

app.use(function(err,req,res,next){
    console.error(err.stack); 
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'),function(){
    console.log('Express started on http://localhost:'+app.get('port')+'l press Ctrl-c to terminate!');
});


