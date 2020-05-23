const { Router, request, response } = require("express");
const { validateAccessToken, getResource } = require("./controller");
const route = Router();

route.get("/scopes", async (request, response) => {
  console.log("GET /resource " + JSON.stringify(request.query));
  await validateAccessToken(request, response);
});


module.exports = route;
