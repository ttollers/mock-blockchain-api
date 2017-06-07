A JSON file is provided which contains data captured from a hypothetical blockchain. Each block has some metadata and also contains the transactions that were validated in that block.

The transactions in this example correspond to calls to 2 hypothetical smart contracts: one for "accounts" and one for "documents".

In our contrived system we are using the blockchain as a decentralised audit log to associate uploaded documents with the user account who uploaded them.

There is a possible transaction payload for: creating an account, updating an account, and creating a document.

Use this file as a data source to create a simple HTTP server with Node.js which implements a JSON API with the following routes:

`GET /documents`

Lists all of the documents

`GET /documents/:documentID`

Returns one document by ID

`GET /accounts/:accountID`

Returns one account by ID

`GET /accounts/:accountID/documents`

For an account ID, lists the documents created by that account

Document objects should contain the following properties:

 - id
 - fileLocation
 - title
 - type
 - hash
 - createdTime (timestamp of the block when the document was created)
 - createdBlock (block number of the block in which the document was created)
 - uploadedBy (blockchain address used to create the document)

Account objects should contain the following properties:

 - id
 - nickname
 - address (blockchain address used to create the account)
 - createdTime (timestamp of the block when the account was created)
 - createdBlock (block number of the block when the account was created)
 - updatedTime (timestamp of the block when the account was updated)
 - createdBlock (block number of the block when the account was updated)

Document data must be decrypted before serving it on the API. The ciphertext and symmetric encryption key are provided in the transaction payload in base64 format. The encryption key is encrypted asymmetrically for the RSA 2048 key pair provided. The output format for the ciphertext is utf8. The output format for the encryption key is hex. The cipher algorithm used is 'aes-256-cbc'. It should be possible to do this with the native node Crypto module, and a fairly recent openssl on your system.

We will be considering how you choose to structure your code, your coding style, and the implementation decisions you made, especially when it relates to performance and security.

We would prefer utilisation of the latest JavaScript features (such as async/await) however it is not strictly necessary. You may use libraries as you wish. We use Restify for the HTTP server but you may use Express or something else.

The server does not need to support authentication, caching, dockerfiles logging or even tests(!).

When you are finished, create a zip file of your source repo containing your solution and send it back to us via email. No node_modules folder please :)
