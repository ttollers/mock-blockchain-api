"use strict";

const blocks = require("../dist/blocks.json");
const crypto = require("crypto");
const hl = require("highland");
const { createReadStream } = require("fs");
const algorithm = 'aes-256-cbc';
const R = require("ramda");

// My experience here is, admittedly, lacking. I'm not sure
// about best practice here and what I'm missing!

// String -> String -> Stream[DecryptedData]
module.exports = R.curry((encryptedKey, encryptedData) => {

  return hl(createReadStream("./dist/privKey.pem"))
    .invoke("toString", ["utf-8"])
    .map(privateKey => crypto.privateDecrypt(privateKey, new Buffer(encryptedKey, 'base64')))
    .invoke("toString", ["hex"])
    .map(key => crypto.createDecipher(algorithm, key))
    .map(decipher => {
      const decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      return decrypted + decipher.final("utf8");
    })
    .map(JSON.parse)
});
