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
            res.json({status: 200, message: "Get data done", numItems: numItems});
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
            res.json(numItems[0]);
        });
        } else {
            res.json(false);
        }
    });
});

/**API Update thông tin mua hàng đươc gọi từ client server*/
app.post('/update/product/status', async function (req, res) {
    try {
        let data = await insertProductSelling(req.body);
        if(data){
            res.redirect('/getProductSelling');
        }
    }catch (e){
        res.json(e)
    }
});

function insertProductSelling(req) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect('mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1', function (err, db) {
            assert.equal(null, err);
            db.collection('product_selling').insertMany(req).then(function(err, numItems) {
                db.close();
                if(err) return reject(err);
                resolve(1);
            });
        });
    });
}

/**cap nhat db product_selling*/
app.get('/getProductSelling', function (req, res) {
    MongoClient.connect('mongodb://admin:uitvn@ds127436.mlab.com:27436/lab1_business?authMechanism=SCRAM-SHA-1', function (err, db) {
        assert.equal(null, err);
        db.collection('product_selling').find().toArray().then(function(numItems) {
            db.close();
            res.json(numItems)
        });
    });
});

let ser = app.listen(8081, function () {
    let host = ser.address().address;
    let port = ser.address().port;
});