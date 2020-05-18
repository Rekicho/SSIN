var express = require("express");
var bodyParser = require('body-parser');
var cons = require('consolidate');
var __ = require('underscore');
__.string = require('underscore.string');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', 'files/authorizationServer');
app.set('json spaces', 4);

// authorization server information
var authServer = {
	authorizationEndpoint: 'http://localhost:9001/authorize',
	tokenEndpoint: 'http://localhost:9001/token'
};

// client information
var clients = [
	{
		"client_id": "oauth-client-1",
		"client_secret": "oauth-client-secret-1",
		"redirect_uris": ["http://localhost:9000/callback"],
		"scope": "foo bar"
	}
];

var codes = {};

var requests = {};

const authCodes = new Set();

app.get('/', function(req, res) {
	res.render('index', {clients: clients, authServer: authServer});
});

app.use('/', express.static('files/authorizationServer'));

var server = app.listen(9001, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('OAuth Authorization Server is listening at http://%s:%s', host, port);
});

//this is vulnerable to CSRF Attack
//TODO
app.post('/auth-code', (req, res) => {
	const authCode = new Array(10).fill(null).map(() => Math.floor(Math.random() * 10)).join('');

	authCodes.add(authCode);
	res.redirect(`http://localhost:9000/?code=${authCode}`);
});
 
