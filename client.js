var express = require("express");
var cors = require("cors");
var cons = require("consolidate");
var http = require("http");

const request = require("request");

var app = express();
app.use(cors());

app.engine("html", cons.underscore);
app.set("view engine", "html");
app.set("views", "files/client");

var access_token = null;
var refresh_token = null;
var scope = null;

const client_id = "oauth-client-1";
const client_secret = "oauth-client-secret-1";

app.get("/", function (req, res) {
  res.render("index", {
    client_id: client_id,
    access_token: access_token,
    refresh_token: refresh_token,
    scope: scope,
  });
});

app.get("/callback", function (req, res) {
  const code = req.query.code;

  request.post(
    "http://127.0.0.1:9001/token",
    {
      form: {
        grant_type: "authorization_code",
        code: code,
        client_id: client_id,
      },
      headers: {
        Authorization: "Basic " + client_secret,
      },
    },
    (err, response, body) => {
      body = JSON.parse(body);

      access_token = body.access_token;
      refresh_token = body.refresh_token;
      //Needs Scope
      res.redirect("/");
    }
  );
});

app.use("/", express.static("files/client"));

var server = app.listen(9000, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("OAuth Client is listening at http://%s:%s", host, port);
});
