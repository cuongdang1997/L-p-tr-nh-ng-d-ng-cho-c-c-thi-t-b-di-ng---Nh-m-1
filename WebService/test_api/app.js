var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require("./routes/routes.js");
var app = express();

//----Kết nối Mongodb bằng mongoose
var mongodb_url = 'mongodb://localhost:27017/tink39_2';
mongoose.Promise = global.Promise;
var MongoOptions = {
    poolSize: 10,
    reconnectTries: 3600,
    reconnectInterval: 1000,
    autoReconnect: true,
    useNewUrlParser: true
};

mongoose.connect(mongodb_url, MongoOptions);
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('...MONGO EVENT ERROR');
});
db.on('connected', function () {
    console.log('...MONGO EVENT CONNECTED');
    console.log('Database name:' + db.name);
});
//---------------


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});