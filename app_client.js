var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
const dbClient1 = 'mongodb://client1:uitvn@ds127536.mlab.com:27536/lab1_client1';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/list-business-from-server', function (req, res) {
    request('http://localhost:8081/listBusiness', function(error, response, data) {
    	if (!error && response.statusCode == 200) {
    		res.json(data);
  		}
    });
});
app.get('/list-business/:productID', function (req, res) {
    try {
        MongoClient.connect(dbClient1, async function (err, db) {
            assert.equal(null, err);
            let list_business = [];
            let list_product = [];
            await db.collection('product').find({"productID": req.params.productID}).toArray().then( function (products) {
                db.close();
                list_product = products;

            });
            if (list_product) {
                for (let i = 0; i < list_product.length; i++) {
                    let data = await  getBusinessDetail(list_product[i].businessID);
                    list_business.push(data);
                }
            }
            res.json(list_business);
        });
    } catch (e) {
        console.log(e);
    }
});

function getBusinessDetail(businessID) {
    return new Promise(function (resolve, reject) {
        request('http://localhost:8081/businessDetail/' + businessID, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

var server = app.listen(8082, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});