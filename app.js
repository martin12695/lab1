let express = require('express');
const mongodb = require('mongodb');
let bodyParser = require('body-parser');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const assert = require('assert');

let app = express();
let fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
});