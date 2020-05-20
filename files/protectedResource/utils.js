const fs = require('fs');

const http = require('http');
const https = require('https');



function getJSON(options) {
    console.log('rest::getJSON');
    const port = options.port == 9001 ? https : http;
  
    let output = '';
  
    const req = port.request(options, (res) => {
      console.log(`${options.host} : ${res.statusCode}`);
      res.setEncoding('utf8');
  
      res.on('data', (chunk) => {
        output += chunk;
      });
  
      res.on('end', () => {
        let obj = JSON.parse(output);

        const {tokens} = obj;
  
        console.log(res.statusCode, ':', obj);

        return obj;
        
      });
    });
  
    req.on('error', (err) => {
      // res.send('error: ' + err.message);
    });
  
    req.end();
  };
  

//Introspect request
function getTokens(){
    const options = {
        host: 'localhost',
        port: 9001,
        path: '/token', // update to introspect url
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

    return getJSON(options);
}


function readFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        console.log(data);
        return data;
    } catch (err) {
        console.error(err)
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


