const express = require('express');
const async = require('async');
const fs = require('fs');
const multer  = require('multer');
const visionClient = require('./VisionClient');
var TesseractClient = require('./api');
const cons = require('consolidate');
const dust = require('dustjs-linkedin');
var path = require('path');
var session = require('express-session');

var app = express();

app.use(session({
  secret: 'jitocr'
}))

//view engine as dust
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.set('port', (process.env.PORT || 8656));

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
    var data = {
        imgsrc: req.session.ocrdata
    }
   console.log('Crop Route',data);
   console.log(req.session.ocrdata);
    res.render('crop',{data:data});
})

app.post('/fileupload', upload.single('avatar'), function (req, res) {

    var result, payload;
    console.log(req.file.filename);
    var locallocation = 'uploads/' + req.file.filename;
    req.session.ocrdata = locallocation;
    res.redirect('/crop');
   
});

var cropPositions = [];
var imgPath = null;
app.get('/fetchData',function(req,res){
    console.log('From Crop',req.query);
    cropPositions = req.query;
    imgPath = req.session.ocrdata;
     TesseractClient.doScan(req, res, cropPositions,imgPath,function (data) {
        if (data) {
            res.send(true);
            // TesseractClient.fetchDataByVision(req, res, function (data) {
            //     res.send(data);
            // })
        }
    });
})

app.get('/scan',function(req,res){
    TesseractClient.fetchDataByTesseract(req,res,function(result){
        res.send(result);
    });

})


app.listen(app.get('port'),function(){
    console.log("server running on port",app.get('port'));
});
