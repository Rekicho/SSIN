var express = require("express");
const { getTokenInfo, readFile, writeToFile } = require("./utils");

const scopes = [
  {
    username: "SSIN",
    read: true,
    write: true,
    delete: true,
  },
];

async function validateAccessToken(request, response) {
  console.log("Headers: " + JSON.stringify(request.headers));
  console.log("Body: " + JSON.stringify(request.body));

  const token = request.header("Authorization").replace("Bearer ", "");

  const tokenInfo = await getTokenInfo(token);

  if (!tokenInfo) {
    return response.status(401).send("");
  }

  const user = scopes.find((elem) => elem.username === tokenInfo.username);

  if (!user) {
    return response.status(401).send("");
  }

  const scope = {
    read: tokenInfo.scope.includes("read") && user.read,
    write: tokenInfo.scope.includes("write") && user.write,
    delete: tokenInfo.scope.includes("delete") && user.delete,
  };

  return scope;
}

function getResource() {

  const file = readFile("./files/protectedResource/resources/resource.json");
  const content = JSON.parse(file);
  console.log("content:", content);
  return content;
}

async function addWord(request, response){
  const scopes = await validateAccessToken(request, response);
  console.log("SCOPE", scopes);
  if(scopes["write"])
  {
    let content = getResource();
    console.log("WRITE", request.body.word ,":", request.body.meaning)
    const newEntry = {"word": request.body.word, "meaning": request.body.meaning};
    content.push(newEntry);
    await writeToFile("./files/protectedResource/resources/resource.json", JSON.stringify(content));
    return response.send("OK");
    
  }
  response.status(401).send('Insufficient permission: NO WRITE SCOPE')
}

async function deleteWord(){

}



module.exports = { validateAccessToken, addWord,  };
