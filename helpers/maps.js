"use strict";

const R = require("ramda");
const decrypt = require("./decrypt");

module.exports = {

  // Block A -> [FlattenedTransaction]
  flattenItem: item => {
    const meta = R.pick(["miner", "number", "timestamp"])(item);
    return item.transactions.map(R.merge(meta));
  },
  
  // EncryptedDocument A -> Stream[DecryptedDocument A]
  decryptAndMergeDocument: item => {
    const { encryptionKey, encryptedData, id, hash } = item.payload.args;
    return decrypt(encryptionKey, encryptedData)
      .map(R.merge({
        id: id,
        hash: hash,
        createdTime: item.timestamp,
        createdBlock: item.number,
        createdBy: item.from
      }))
  }

};
