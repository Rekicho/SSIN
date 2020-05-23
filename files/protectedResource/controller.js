var express = require("express");
const { getTokenInfo, readFile, writeToFile } = require("./utils");

const scopes = [
  {
    username: "SSIN-all",
    read: true,
    write: true,
    delete: true,
  },
  {
    username: "SSIN-read",
    read: true,
    write: false,
    delete: false,
  },
  {
    username: "SSIN-write",
    read: false,
    write: true,
    delete: false,
  },
  {
    username: "SSIN-delete",
    read: false,
    write: false,
    delete: true,
  },
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
  return content;
}

async function addWord(request, response) {
  const scopes = await validateAccessToken(request, response);
  if (scopes["write"]) {
    let content = getResource();
    const newEntry = { "word": request.body.word, "meaning": request.body.meaning };
    const index = content.findIndex(element => element.word === request.body.word);
    if (index !== -1) {
      return response.send("Word already exists");
    }
    content.push(newEntry);
    await writeToFile("./files/protectedResource/resources/resource.json", JSON.stringify(content));
    return response.send("Word Added Successfully!");

  }
  response.status(401).send('Insufficient permission: NO WRITE SCOPE')
}

async function deleteWord(request, response) {
  const scopes = await validateAccessToken(request, response);

  if (scopes["delete"]) {
    let content = getResource();
    const beforeDeleteLength = content.length;
    const index = content.findIndex(element => element.word === request.body.word);

    if (index === -1)
      return response.send(`Word not found`);

    content.splice(index, 1);

    if (beforeDeleteLength == content.length)
      return response.send(`Word not deleted`);

    await writeToFile("./files/protectedResource/resources/resource.json", JSON.stringify(content));
    return response.send(`Word deleted successfully`);
  }
  response.status(401).send('Insufficient permission: NO WRITE SCOPE')
}

async function readWord(request, response) {
  const scopes = await validateAccessToken(request, response);
  if (scopes["read"]) {
    let content = getResource();
    const meaning = content.find(element => element.word === request.body.word);
    if (meaning === undefined)
      return response.send(`Word not found`);
    return response.send(`${meaning.meaning}`);
  }
  response.status(401).send('Insufficient permission: NO READ SCOPE')
}



module.exports = { validateAccessToken, addWord, readWord, deleteWord };
