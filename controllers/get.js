"use strict";

const blocks = require("../dist/blocks.json");
const R = require("ramda");
const hl = require("highland");
const decrypt = require("../helpers/decrypt");
const { flattenItem, decryptAndMergeDocument } = require("../helpers/maps");
const groupedItems = R.groupBy(R.path(["transactions", 0, "payload", "scope"]))(blocks);

const documents = R.flatten(groupedItems.DOCUMENTS.map(flattenItem));
const accounts = R.flatten(groupedItems.ACCOUNTS.map(flattenItem));

module.exports = {

  // Because of time pressures, I've not used any data validation, 4xx status code handling,
  // error logging etc. In reality this would be a given.

  "documents": (req, res) => {
    hl(documents)
      .flatMap(decryptAndMergeDocument)
      .stopOnError(e => res.statusCode(500))
      .toArray(items => res.send(items));
  },

  "documentsByID": (req, res) => {
    hl(documents)
      .find(item => item.payload.args.id === req.params.documentID)
      .flatMap(decryptAndMergeDocument)
      .otherwise(["Doesn't Exist"])
      .stopOnError(e => res.statusCode(500))
      .apply(item => res.send(item));
  },

  "accountByID": (req, res) => {
    hl(accounts)
      .filter(item => item.payload.args.id === req.params.accountID)
      .sortBy((a,b) => new Date(a.timestamp) - new Date(b.timestamp))
      .reduce1((acc, item) => {
        return R.compose(
          R.assoc("updatedTime", item.timestamp),
          R.assoc("updatedBlock", item.number),
          R.over(R.lensPath(["payload", "args"]), R.flip(R.merge)(item.payload.args))
        )(acc);
      })
      .map(item => {
        return R.merge(item.payload.args, {
          createdTime: item.timestamp,
          createdBlock: item.number,
          updatedTime: item.updatedTime || item.timestamp,
          updatedBlock: item.updatedBlock || item.number
        })
      })
      .otherwise(["Doesn't Exist"])
      .stopOnError(e => res.statusCode(500))
      .apply(item => res.send(item));
  },

  "documentsByAccountID": (req, res) => {
    hl(accounts)
      .find(account => account.payload.args.id === req.params.accountID && account.payload.method === "CREATE")
      .flatMap(account => hl(documents).filter(document => document.from === account.payload.args.address))
      .flatMap(decryptAndMergeDocument)
      .stopOnError(e => res.statusCode(500))
      .toArray(documents => res.send(documents));
  }
};
