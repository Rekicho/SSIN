const { Router, request, response } =  require("express");
const {validateAccessToken, getResource} =  require("./controller"); 
const route = Router();   

route.get('/resource/:id', (request, response) =>{
    validateAccessToken(request, response, getResource);
});

module.exports = route;