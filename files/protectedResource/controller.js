var express = require("express");
const {getTokens, readFile, writeToFile} = require('./utils');


function validateAccessToken(request, response, next){
    let valid;

    const token = request.body.token;

    const listTokens = getTokens();

    valid = listTokens.includes(token);

    if(!valid){
        response.status(403).send(cause);   
    }
    next(request, response);
}

function getResource(request, response){
    
    const resource = request.body.resource;

    //TODO: check scope

    const content = readFile('./resources/' + resource);

    response.status(400).send(content);

}

