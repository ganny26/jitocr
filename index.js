const express = require('express');
const async = require('async');
const fs = require('fs');
const multer  = require('multer');
const visionClient = require('./VisionClient');
var TesseractClient = require('./api');
const cons = require('consolidate');
const dust = require('dustjs-linkedin');
var path = require('path');

var app = express();


//view engine as dust
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, '/')));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadFileLocation = 'uploads/'
        cb(null, uploadFileLocation)
    },
    filename: function (req, file, cb) {
        var customFileName = Date.now() + '_' + file.originalname;
        cb(null, customFileName)
    }
})

var upload = multer({ storage: storage })

app.get('/', function(req, res,next) {
    res.render('index');
});

app.get('/crop',function(req,res){
    res.render('crop');
})

app.post('/fileupload', upload.single('avatar'), function (req, res) {
    var result, payload;
    res.redirect('/crop');
    // TesseractClient.doScan(req, res, function (data) {
    //     if (data) {
    //         TesseractClient.fetchDataByVision(req, res, function (data) {
    //             res.send(data);
    //         })
    //     }
    // });
});


app.listen(8656,function(){
    console.log("server running on http://localhost:8656");
});
