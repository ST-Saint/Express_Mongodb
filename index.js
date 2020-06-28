const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const app = express();
const port = 3000;
const max_limit = 65536;

var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/anything";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

let anythingRecord = {
    content: Object
};

var Schema = mongoose.Schema;

var anythingSchema = new Schema(anythingRecord, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
var Record = mongoose.model('records', anythingSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Successful connection to "+url);
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data
app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body), JSON.stringify(req.body).length);
    var raw_data = JSON.stringify(req.body);
    if( raw_data.length>max_limit){
        res.send('400 Bad Request', 400);
        return;
    }
    var rec = new Record({content: req.body});
    rec.save(function(error,doc){  // 保存数据于 test1
        if(error){
            console.log("error :" + error);
        }else{
            console.log(doc);
        }
    });

    // req.socket.end(); //drop
    res.json(req.body);
    // res.send('500 Internal Server Error', 500);
});

// app.get('/', function(req, res) {
//     console.log(`Example app listening on port ${req.get()}!`) ;
//     res.send(404);});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
