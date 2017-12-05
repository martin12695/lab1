let express = require('express');
const mongodb = require('mongodb');
let bodyParser = require('body-parser');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const assert = require('assert');
let request = require('request');

let app = express();
let fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**DANH SACH CAC DOANH NGHIEP TRONG BUSINESS DB*/
app.get('/listBusiness', function (req, res) {
    MongoClient.connect('mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1', function (err, db) {
        assert.equal(null, err);
        db.collection('business_info').find().toArray().then(function(numItems) {
            db.close();
            res.json(numItems)
        });
    });
});

/**THONG TIN KHACH HANG NAO DA SU DUNG SAN PHAM CUA TUNG DOANH NGHIEP*/
app.get('/customer-detail-from-client', function (req, res) {
    request('http://localhost:8082/customerDetail', function(error, response, data) {
        if (!error && response.statusCode == 200) {
            res.json(data);
        }
    });
});

/**THONG TIN CHI TIET DOANH NGHIEP*/
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

/**UPDATE SAN PHAM(producID) THUOC DOANH NGHIEP(businessID) NAO DUOC KHACH HANG(customerID) MUA VOI SO LUONG BAO NHIEU*/
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