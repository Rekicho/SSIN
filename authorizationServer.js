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
	},
	{
		"client_id": "oauth-client-2",
		"client_secret": "oauth-client-secret-2",
		"redirect_uris": ["http://localhost:9000/callback"],
		"scope": "foo bar"
	}
];

var codes = {};

var requests = [];

app.get('/', function (req, res) {
	res.render('index', { clients: clients, authServer: authServer });
});

app.post('/token', function (req, res) {
	const grant_type = req.params.grant_type;
	const code = req.query.code;
	const client_id = req.query.client_id;
	const client_secret = req.query.client_secret;

	// Verify parameters
	console.log(req.body.info);
	console.log(grant_type);

	res.send(clients);
});

app.use('/authorize', function (req, res) {
	const response_type = req.query.response_type;
	const client_id = req.query.client_id;

	if (response_type === "code" && client_id != null) {
		requests.push({ "client_id": client_id, "response_type": response_type });

		res.render('authentication', { client_id: client_id, response_type: response_type });
	} else {
		throw new Error('PARAMETERS MISSING!!!!!');
	}
});

app.post('/submit-credentials', (req, res) => {
	const username = req.body.identifier;
	const password = req.body.password;
	const client_id = req.body.client_id;
	const response_type = req.body.response_type;

	console.log(username, password, client_id, response_type);

	for (let i = 0; i < clients.length; i++) {
		if (clients[i].client_id == client_id) {
			res.redirect(clients[i].redirect_uris[0] + '?code=IDontKnowWhatToPutInHere');
			return;
		}
	}
});

app.use('/', express.static('files/authorizationServer'));

var server = app.listen(9001, 'localhost', function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('OAuth Authorization Server is listening at http://%s:%s', host, port);
});

