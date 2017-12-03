var express = require('express');
const mongodb = require('mongodb');
var bodyParser = require('body-parser');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const assert = require('assert');

var app = express();
var fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = "mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1";

app.get('/listBusiness', function (req, res) {
    MongoClient.connect('mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1', function (err, db) {
        assert.equal(null, err);
        db.collection('business_info').find().toArray().then(function(numItems) {
            db.close();
            res.json(numItems)
        });
    });
});

app.get('/businessDetail/:id', function (req, res) {
    MongoClient.connect('mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1', function (err, db) {
        assert.equal(null, err);
        if (req.params.id){
            db.collection('business_info').find({"businessID" : req.params.id}).toArray().then(function(numItems) {
            db.close();
            res.json(numItems);
        });
        } else {
            res.json(false);
        }
    });

});

app.post('/update/product/status', function (req, res) {
    MongoClient.connect('mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1', function (err, db) {
        assert.equal(null, err);
        db.collection('product_selling').insertMany(req.body).then(function(numItems) {
            db.close();
            res.json(1);
        });
    });
});

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

});