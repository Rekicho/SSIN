var express = require("express");
const {getTokens, readFile, writeToFile} = require('./utils');


function validateAccessToken(request, response, next){
    let valid;

    const token = request.body.token;

    const listTokens = getTokens();

    //valid = listTokens.includes(token);

    valid =true;

    if(!valid){
        response.status(403).send(cause);   
    }
    next(request, response);
}

function getResource(request, response){
    
    const resource = request.params.id;

    //TODO: check scope

    
    const content = readFile('./files/protectedResource/resources/' + resource);

    response.status(400).send(content);
}

module.exports = {validateAccessToken, getResource};

