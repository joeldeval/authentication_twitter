
var url = require('url');
var express = require('express');
var authenticator = require('./authenticator');
var config = require('./config');
var app = express();

// agregamos cookie parsing 
app.use(require('cookie-parser')());

// toma usuario de twitter
app.get('/auth/twitter', authenticator.redirectToTwitterLoginPage);

// This is the callback url
app.get(url.parse(config.oauth_callback).path, function(req, res){
	authenticator.authenticate(req, res, function(err){
		if(err){
			console.log(err);
			res.sendStatus(401);
		} else {
			res.send("Authentication Successful");
		}
	});
})

app.listen(config.port, function(){
	console.log("Escuchando en puerto "+ config.port)
});
