var express = require("express");
var cons = require('consolidate');
var http = require('http');

var app = express();

app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', 'files/client');

var access_token = null;
var refresh_token = null;
var scope = null;

app.get('/', function (req, res) {
  res.render('index', { access_token: access_token, refresh_token: refresh_token, scope: scope });
});

app.get('/authorize', function (req, res) {
  var data = JSON.stringify({
    client_id: "oauth-client-1"
  });

  var options = {
    host: server.address().address,
    port: 9001,
    path: '/authorization',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

  var httpRequest = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
    });
    response.on('end', function () {
      // res.send('ok');
      res.render('index', { access_token: access_token, refresh_token: refresh_token, scope: scope });
    });

  });

  httpRequest.write(data);
  httpRequest.end();
});

app.use('/', express.static('files/client'));

var server = app.listen(9000, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('OAuth Client is listening at http://%s:%s', host, port);
});

