"use strict";

const request = require("supertest");
const app = require("../server.js");
const assert = require("chai").assert;

describe("Component", () => {

  // Sunny day tests. These are more just to keep the code runnable and help with development.
  // If I was doing this properly I would unit test fully with every case checked

  it("GET /documents", done => {
    request(app)
      .get("/documents")
      .end((err, res) => {
        assert.equal(res.body.length, 5);
        done();
      })
  });

  it("GET /documents/:documentID", done => {
    request(app)
      .get("/documents/fcb5df34-4c32-427d-895d-70fd5cd3d296")
      .end((err, res) => {
        assert.equal(res.body.id, 'fcb5df34-4c32-427d-895d-70fd5cd3d296');
        assert.equal(res.body.hash, '8026ab2d1648d620e3c7475d586f23b48b82f07795acb8732add4b54eb7a7293');
        assert.equal(res.body.createdTime, '2017-05-23T11:41:00.081Z');
        assert.equal(res.body.createdBlock, 3);
        assert.equal(res.body.createdBy, '0x805fcb4c901cb4d8562267fbfc85faa498ec2e32');
        assert.equal(res.body.fileLocation, 'https://tallysticks-fake.s3.amazonaws.com/docs/fcb5df34-4c32-427d-895d-70fd5cd3d296');
        assert.equal(res.body.title, 'Maribeth Jucean Tifany Lorio Antony Malinoski');
        assert.equal(res.body.type, 'WAYBILL');
        done();
      });
  });

  it("GET /accounts/:accountID", done => {
    request(app)
      .get("/accounts/1455f1a8-964d-4dc3-bc7c-6ac3443dab93")
      .end((err, res) => {
        assert.equal(res.body.id, '1455f1a8-964d-4dc3-bc7c-6ac3443dab93');
        assert.equal(res.body.address, '0x805fcb4c901cb4d8562267fbfc85faa498ec2e32');
        assert.equal(res.body.nickname, 'UserOne #MakeBlockchainGreatAgain');
        assert.equal(res.body.createdTime, '2017-05-23T11:21:00.081Z');
        assert.equal(res.body.createdBlock, 1);
        assert.equal(res.body.updatedTime, '2017-05-23T12:01:00.081Z');
        assert.equal(res.body.updatedBlock, 5);
        done();
      });
  });

  it("GET /accounts/:accountID/documents", done => {
    request(app)
      .get("/accounts/1455f1a8-964d-4dc3-bc7c-6ac3443dab93/documents")
      .end((err, res) => {
        assert.equal(res.body.length, 3);
        done();
      });
  });

});
