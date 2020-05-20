var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var cons = require("consolidate");
var __ = require("underscore");
__.string = require("underscore.string");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const AUTH_CODE_EXPIRE = 300;
const ACCESS_TOKEN_EXPIRE = 3600;
const REFRESH_TOKEN_EXPIRE = 31556926; //Refresh tokens are long-lasting

var app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", cons.underscore);
app.set("view engine", "html");
app.set("views", "files/authorizationServer");
app.set("json spaces", 4);

// authorization server information
var authServer = {
  authorizationEndpoint: "http://localhost:9001/authorize",
  tokenEndpoint: "http://localhost:9001/token",
};

// client information
var clients = [
  {
    client_id: "oauth-client-1",
    client_secret: "oauth-client-secret-1",
    redirect_uris: ["http://localhost:9000/callback"],
    scope: "foo bar",
    tokens: [],
    refresh_token: null,
  },
];

const users = [
  {
    username: "SSIN",
    password: "$2b$12$HGaPQ3JQOKZXyTqq8YXuBe/03Yps2LMHpiI9AEYwpQD5BujjS1BD.",
    scope: "foo bar",
  },
];

const codes = [];

app.get("/", function (req, res) {
  res.render("index", { clients: clients, authServer: authServer });
});

app.use("/authorize", function (req, res) {
  const response_type = req.query.response_type;
  const client_id = req.query.client_id;
  const error = req.query.error;

  const client = clients.find((elem) => elem.client_id === client_id);

  if (response_type !== "code" || !client)
    return res.status(404).send({ error: "invalid_request" });

  res.render("authentication", {
    client_id: client_id,
    response_type: response_type,
    error: error,
  });
});

app.post("/submit-credentials", async (req, res) => {
  const username = req.body.identifier;
  const password = req.body.password;
  const client_id = req.body.client_id;
  const response_type = req.body.response_type;

  const client = clients.find((elem) => elem.client_id === client_id);
  const user = users.find((elem) => elem.username === username);

  if (!client || !user)
    return res.redirect(
      "/authorize?response_type=" +
        response_type +
        "&client_id=" +
        client_id +
        "&error=BadRequest"
    );

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.redirect(
      "/authorize?response_type=" +
        response_type +
        "&client_id=" +
        client_id +
        "&error=BadRequest"
    );

  const code = crypto.randomBytes(64).toString("hex");

  codes.push({
    code: code,
    client_id: client_id,
    expires: new Date().getTime() + AUTH_CODE_EXPIRE,
  });

  res.redirect(client.redirect_uris[0] + "?code=" + code);
});

var requests = [];

app.get("/", function (req, res) {
  res.render("index", { clients: clients, authServer: authServer });
});

app.use("/", express.static("files/authorizationServer"));

const grantAuthCode = (req, res) => {
  if (!req.body.code || !req.body.client_id)
    return res.status(400).send({ error: "invalid_request" });

  const client = clients.find((elem) => elem.client_id === req.body.client_id);
  const code = codes.find((elem) => elem.code === req.body.code);

  if (
    !client ||
    req.header("Authorization") !== "Basic " + client.client_secret
  )
    return res.status(400).send({ error: "invalid_client" });

  if (!code || code.expires < new Date().getTime())
    return res.status(400).send({ error: "invalid_grant" });

  if (code.client_id != req.body.client_id)
    return res.status(400).send({ error: "unauthorized_client" });

  const token = crypto.randomBytes(64).toString("hex");

  client.tokens.push({
    access_token: token,
    expires: new Date().getTime() + ACCESS_TOKEN_EXPIRE,
  });

  if (
    !client.refresh_token ||
    client.refresh_token.expires < new Date().getTime()
  ) {
    client.refresh_token = {
      token: crypto.randomBytes(64).toString("hex"),
      expires: new Date().getTime() + REFRESH_TOKEN_EXPIRE,
    };
  }

  return res.send({
    access_token: token,
    refresh_token: client.refresh_token.token,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_EXPIRE,
  });
};

// Change Refresh Tokens not to beo only 1 per client
const grantRefreshToken = (req, res) => {
  if (!req.body.refresh_token)
    return res.status(400).send({ error: "invalid_request" });

  const client = clients.find(
    (elem) => "Basic " + elem.client_secret === req.header("Authorization")
  );

  if (!client) return res.status(400).send({ error: "invalid_client" });

  if (
    !client.refresh_token ||
    client.refresh_token.token != req.body.refresh_token
  )
    return res.status(400).send({ error: "unauthorized_client" });

  const token = crypto.randomBytes(64).toString("hex");

  client.tokens.push({
    access_token: token,
    expires: new Date().getTime() + ACCESS_TOKEN_EXPIRE,
  });

  return res.send({
    access_token: token,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_EXPIRE,
  });
};

app.post("/token", function (req, res) {
  res.setHeader("Content-Type", "application/json;charset=UTF-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");

  if (!req.body.grant_type)
    return res.status(400).send({ error: "invalid_request" });

  if (req.body.grant_type === "authorization_code")
    return grantAuthCode(req, res);
  else if (req.body.grant_type === "refresh_token")
    return grantRefreshToken(req, res);

  return res.status(400).send({ error: "unsupported_grant_type" });
});

var server = app.listen(9001, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(
    "OAuth Authorization Server is listening at http://%s:%s",
    host,
    port
  );
});
