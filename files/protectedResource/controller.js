var express = require("express");


function validateAccessToken(request, response,next){
    let valid;

    if(!valid){
        response.status(400).send(cause);   
    }
    next();
}

