var express = require("express");
const { getValidToken, readFile } = require("./utils");

async function validateAccessToken(request, response, next) {
  const token = request.header("Authorization").replace("Bearer ", "");

  const valid = await getValidToken(token);

  if (!valid) {
    return response.status(401).send("");
  }

  next(request, response);
}

function getResource(request, response) {
  const resource = request.params.id;

  //TODO: check scope

  const file = readFile("./files/protectedResource/resources/" + resource);
  const content = JSON.parse(file)["content"];
  response.status(400).send(content);
}

module.exports = { validateAccessToken, getResource };
