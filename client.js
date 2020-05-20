var express = require("express");
var cons = require("consolidate");
var http = require("http");

var app = express();

app.engine("html", cons.underscore);
app.set("view engine", "html");
app.set("views", "files/client");

var access_token = null;
var refresh_token = null;
var scope = null;

// REQUEST VALUES
const client_id = "oauth-client-1";
const secret_id = "oauth-client-secret-1";

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

  if (typeof code === "undefined") throw new Error("Code not provided!");

  var data = JSON.stringify({
    info: {
      grant_type: "authorization_code",
      code: code,
      client_id: client_id,
      secret_id: secret_id,
    },
  });

  var options = {
    host: server.address().address,
    port: 9001,
    auth: "Basic " + new Buffer.from("username" + ":" + "password", "base64"),
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  var httpRequest = http.request(options, function (response) {
    response.setEncoding("utf8");
    response.on("data", function (chunk) {
      console.log("body: " + chunk);
    });
    response.on("end", function () {
      // res.send('ok');
      res.render("index", {
        access_token: "asdasd",
        refresh_token: refresh_token,
        scope: scope,
      });
    });
  });

  httpRequest.write(data);
  httpRequest.end();
});

app.use("/", express.static("files/client"));

var server = app.listen(9000, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("OAuth Client is listening at http://%s:%s", host, port);
});
