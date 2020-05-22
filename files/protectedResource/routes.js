const { Router, request, response } = require("express");
const { validateAccessToken, getResource } = require("./controller");
const route = Router();

route.get("/resource/:id", async (request, response) => {
  console.log("GET /resource " + JSON.stringify(request.query));
  await validateAccessToken(request, response, getResource);
});

module.exports = route;
