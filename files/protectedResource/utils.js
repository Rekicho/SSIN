const fs = require('fs');

const crypto = require('crypto');
const { generateKeyPair } = require('crypto');


const algorithm = 'aes-192-cbc';

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

function encryptString(s) {
    const key = "gyMLlwbgQfmfTJmsYbcPs3Va"; //TODO: extract from utils
    console.log(key);

    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(s, 'utf8', 'hex');

    encrypted += cipher.final('hex');
    console.log(encrypted);
    return encrypted
}

function decryptString(s) {
    const key = "gyMLlwbgQfmfTJmsYbcPs3Va"; //TODO: extract from utils

    const iv = Buffer.alloc(16, 0);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(s, 'hex', 'utf8');

    decrypted += decipher.final('utf8');
    console.log(decrypted);
}

function saveKeys(public, private) {
    const enPublic = encryptString(public);
    const enPrivate = encryptString(private);

    writeToFile('./keys/public.txt', enPublic);
    writeToFile('./keys/private.txt', enPrivate);
}

function loadKeys() {
    const enPublic = readFile('./keys/public.txt');
    const enPrivate = readFile('./keys/private.txt');

    const dePublic = decryptString(enPublic);
    const dePrivate = decryptString(enPrivate);

    return {public: dePublic, private: dePrivate};
}

function generateKeys() {
    generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top secret'
        }
    }, (err, publicKey, privateKey) => {
        console.log(publicKey, ' || ', privateKey);
        saveKeys(publicKey, privateKey);
    });
}

generateKeys();
const {public, private} = loadKeys();
console.log(public, " || ", private);


