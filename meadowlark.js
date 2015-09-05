
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

//10中间件
app.use(function(req,res,next){
  console.log('process request for "'+req.url+'"...');
  next();
});
app.use(function(req,res,next){
  //console.log('terminating request');
  //res.send('thanks for playing');
});
app.use(function(req,res,next){
  //console.log('whoops,i\'ll never get called!');
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

var credentials = require('./public/js/credentials.js');
//9.2 cookie&session
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.use(function(req,res,next){
  //如果有即显消息，把他传到上下文中，然后清除它
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

var VALID_EMAIL_REGEX = '^[+-]?\d+(,\d+)*(.\d+(e\d+)?)?$';

app.post('/newsletter',function(req,res){
  var name= req.body.name || '',email = req.body.email||'';
  //输入验证
  if(!email.match(VALID_EMAIL_REGEX)){
    if(req.xhr) return res.json({error:'Invalid name email address'});
    req.session.flash ={
      type:'danger',
      intro:'Validation error!',
      message:'The email address you entered was not valid',
    };
    return res.redirect(303,'/newsletter/archive');
  }
  new NewsletterSignup({name:name,email:email}).save(function(err){
    if(err){
      if(req.xhr) return res.json({error:'Database error.'});
      req.session.flash ={
        type:'success',
        intro:'Database error!',
        message:'There was a Database error;please try again later',
      }
      return res.render(303,'/newsletter/achive');
  }
  if(req.xhr) return res.json({success:true});
      req.session.flash ={
        type:'success',
        intro:'Thank you!',
        message:'You have now been signed up for the newsletter',
      };
    return res.render(303,'/newsletter/achive');
  });
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


