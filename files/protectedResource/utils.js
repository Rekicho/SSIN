const fs = require("fs");

const request = require("request-promise");

const introspect_key =
  "ff61d7d5e447eef6d818d240fc5023b1807cdee480638c3ae38ca2402f387e7560781fc9c1adad16dd0b2144b6fdb7428f275b80c9c008c05409e9475229f705";

//Introspect request
async function getValidToken(token) {
  try {
    const res = await request.post("http://127.0.0.1:9001/introspect", {
      form: {
        token: token,
      },
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + introspect_key,
      },
    });

    return true;
  } catch {
    return false;
  }
}

function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(err);
  }
}

function writeToFile(filePath, content) {
  fs.writeFile(filePath, content, function (error) {
    if (error) {
      return console.log(error);
    }
    console.log("The file was successfully saved!");
  });
}

module.exports = { getValidToken, readFile };
