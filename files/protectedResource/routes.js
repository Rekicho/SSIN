import { Router, request, response } from "express";
import {validateAccessToken, getResource} from "./controller";    

Router.get('resource/:id', (request, response) =>{
    validateAccessToken(request, response, getResource);
});