let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
server.listen(4200);

let request = require('request');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');
var engine = require('consolidate');

app.set('views', __dirname);
app.engine('html', engine.mustache);
app.set('view engine', 'html');

const dbClient1 = 'mongodb://client1:uitvn@ds127536.mlab.com:27536/lab1_client1';

io.on('connection', function (socket) {
    socket.on('request-update-product-selling', function (data) {
        if(data.request){
            request('http://localhost:8081/getProductSelling', function(error, response, data) {
                if (!error && response.statusCode == 200) {
                    setTimeout(function () {
                        socket.emit('response-update-product-selling', {data: data});
                    }, 1800000);//30 phút gui 1 lan
                }
            });
        }
    })
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**GOI API CAP NHAT BEN PHIA SERVER TRA VE DANH SACH DOANH NGHIEP*/
app.get('/list-business-from-server', function (req, res) {
    request('http://localhost:8081/listBusiness', function(error, response, data) {
    	if (!error && response.statusCode == 200) {
    		res.json(data);
  		}
    });
});

/**CHI TIET KHACH HANG MUA SAN PHAM CUA CONG TY NAO*/
app.get('/customerDetail', function (req, res) {
    try{
        MongoClient.connect(dbClient1, async function(err, db) {
            if (err) throw err;
            const col = db.collection('product_selling');
            await col.aggregate([
                // Join with user_info table
                {
                    $lookup:{
                        from: "customer",       // other table name
                        localField: "customerID",   // name of product_selling table field
                        foreignField: "customerID", // name of customer table field
                        as: "customer_info"         // alias for customer table
                    }
                },
                // Join with product table
                {
                    $lookup:{
                        from: "product",
                        localField: "businessID",
                        foreignField: "businessID",
                        as: "product_info"
                    }
                },
                {   $unwind:"$customer_info" },
                {   $unwind:"$product_info" },
                {
                    $project:{
                        _id : 1,
                        quantity: 1,
                        name : "$customer_info.name",
                        address: "$customer_info.address",
                        product_bought : "$product_info.name",
                        product_price: "$product_info.price"
                    }
                }
            ],function (err,result) {
                res.json(result);
            });
        });
    }catch (e){
        res.json(e);
    }
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
                    list_business.push(JSON.parse(data));
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

/**JOB QUAN LY, 30 PHUT CAP NHAT THONG TIN 1 LAN*/
app.get('/list-product-selling-from-server', function (req, res) {
    res.render('test');
});

let ser = app.listen(8082, function () {
    let host = ser.address().address;
    let port = ser.address().port;
});