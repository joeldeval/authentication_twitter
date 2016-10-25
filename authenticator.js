var OAuth = require('oauth').OAuth;
var config = require('./config');

// Crea el objeto de oauth para acceder a twitter
var oauth = new OAuth(
	config.request_token_url,
	config.access_token_url,
	config.consumer_key,
	config.consumer_secret,
	config.oauth_version,
	config.oauth_callback,
	config.oauth_signature
);

module.exports = {
	redirectToTwitterLoginPage: function(req, res){
		// preguntar a Twitter para un token request
		oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
			if(error){
				console.log(error);
				res.send("Authentication failed!");
			}else{
				res.cookie('oauth_token', oauth_token, { httpOnly: true });
				res.cookie('oauth_token_secret', oauth_token_secret, {httpOnly: true});
				res.redirect(config.authorize_url + '?oauth_token='+oauth_token);
			}
		});
	},
	authenticate: function(req, res, cb) {
		if(!(req.cookies.oauth_token && req.cookies.oauth_token_secret && req.query.oauth_verifier)){
			return cb("request does not have all required keys");
		}

		res.clearCookie('oauth_token');
		res.clearCookie('oauth_token_secret');

		cb();
	}
}