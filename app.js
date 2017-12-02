var express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const assert = require('assert');

var app = express();
var fs = require("fs");

app.get('/listBussiness', function (req, res) {
    MongoClient.connect('mongodb://admin:uitvn@ds121192.mlab.com:21192/lab1_client?authMechanism=SCRAM-SHA-1', function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
        db.collection('business_info').find().toArray().then(function(numItems) {
            db.close();
            res.json(numItems)
        });
    });

});

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)

});