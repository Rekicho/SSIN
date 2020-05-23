const { Router, request, response } = require("express");
const { validateAccessToken, addWord, deleteWord, readWord, getResource } = require("./controller");
const route = Router();

route.post("/scopes", async (request, response) => {
  console.log("POST /scopes " + JSON.stringify(request.query));
  const scope = await validateAccessToken(request, response);
  response.send({
    scope: scope,
  })
});

route.post("/add", async (request, response) => {
  console.log("POST /add " + JSON.stringify(request.query));
  await addWord(request, response);
})

route.post("/delete", async (request, response) => {
  console.log("POST /delete " + JSON.stringify(request.query));
  await deleteWord(request, response);
})

route.post("/read", async (request, response) => {
  await readWord(request, response);
})


module.exports = route;
