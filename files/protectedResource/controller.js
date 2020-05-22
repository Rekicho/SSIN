var express = require("express");
const { getTokenInfo, readFile } = require("./utils");

const scopes = [
  {
    username: "SSIN",
    read: true,
    write: true,
    delete: false,
  },
];

async function validateAccessToken(request, response, next) {
  console.log("Headers: " + JSON.stringify(request.headers));
  console.log("Body: " + JSON.stringify(request.body));

  const token = request.header("Authorization").replace("Bearer ", "");

  const tokenInfo = await getTokenInfo(token);

  if (!tokenInfo) {
    return response.status(401).send("");
  }

  const user = scopes.find((elem) => elem.username === tokenInfo.username);

  if (!user) {
    return response.status(401).send("");
  }

  const scope = {
    read: tokenInfo.scope.includes("read") && user.read,
    write: tokenInfo.scope.includes("write") && user.write,
    delete: tokenInfo.scope.includes("delete") && user.delete,
  };

  next(request, response, scope);
}

function getResource(request, response, scope) {
  const resource = request.params.id;

  const file = readFile("./files/protectedResource/resources/" + resource);
  const content = JSON.parse(file)["content"];
  response.send({
    scope: scope,
    content: content,
  });
}

module.exports = { validateAccessToken, getResource };
