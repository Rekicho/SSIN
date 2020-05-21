const { Router, request, response } = require("express");
const { validateAccessToken, getResource } = require("./controller");
const route = Router();

route.get("/resource/:id", async (request, response) => {
  await validateAccessToken(request, response, getResource);
});

module.exports = route;
