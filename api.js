var async = require('async'),
    Tesseract = require('tesseract.js'),
    Jimp = require("jimp"),
    vision = require('@google-cloud/vision');
const projectId = 'oao-india';

const FILE_NAME = __dirname + '/img/passport2.jpg';

/**Google Vision Client */
const visionClient = vision({
    projectId: projectId,
    keyFilename: 'application_default_credentials.json'
});


/*
 * 
 * convert to greyscale
 */
function convertToGreyScale(req, res, next) {
    console.log('inside greyscale conversion');
    var fileName = 'greyscale.jpg';
    var processedImagePath = './public/processed/';
    var imagePath = FILE_NAME;
    Jimp.read(FILE_NAME).then(function (image) {
        console.log('inside jimp')
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (i, j, idx) {
            var red = this.bitmap.data[idx + 0];
            var green = this.bitmap.data[idx + 1];
            var blue = this.bitmap.data[idx + 2];
            var alpha = this.bitmap.data[idx + 3];
            var avg = (red + green + blue) / 3;
            if (avg > 110) {
                this.bitmap.data[idx] = 255
                this.bitmap.data[idx + 1] = 255
                this.bitmap.data[idx + 2] = 255
            } else {
                this.bitmap.data[idx] = 0
                this.bitmap.data[idx + 1] = 0
                this.bitmap.data[idx + 2] = 0
            }
        })
        image.write(processedImagePath + fileName);
        console.log('writting');

    }).catch(function (err) {
        console.log(err);
    });
    return next();
}


function cropImage(req, res, next) {
    var processedImagePath = './public/processed/';
    var greyscaleFileName = './public/processed/greyscale.jpg';
    // var fileName = "0";
    var cropPositions = [
        { "x": 18, "y": 111, "width": 422, "height": 78 },
        { "x": 716, "y": "135", "width": 205, "height": 44 },
        { "x": 315, "y": 346, "width": 256, "height": 52 },
        { "x": 209, "y": 78, "width": 241, "height": 34 }
    ];

    for (var i = 0; i < cropPositions.length; i++) {
        console.log('Looping ', i)
        filename = 'image' + i + '.jpg';
        var data = cropPositions[i];
        Jimp.read(greyscaleFileName).then(function (image) {
            console.log('cropping');
            console.log(data);
            image.crop(parseInt(data.x), parseInt(data.y), data.width, data.height);
            console.log('before write');
            image.write(processedImagePath + filename);
            console.log('after write', processedImagePath + filename);
        }).catch(function (err) {
            console.log(err);
        });
    }

    //  return next();
}


exports.process = function (req, res) {
    console.log('calling process');
    async.applyEachSeries(
        [
            convertToGreyScale,
            cropImage
        ],
        req, res, function (err, res) {
            if (err) {
                console.log('error');
            } else {
                console.log('success');
            }
        }
    );
}

function loop(filename, index, data) {
    console.log("inside loop");
    var fileName = 'image' + index + '.jpg';
    var processedImagePath = __dirname + '/processed/';
    Jimp.read(filename).then(function (image) {
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (i, j, idx) {
            var red = this.bitmap.data[idx + 0];
            var green = this.bitmap.data[idx + 1];
            var blue = this.bitmap.data[idx + 2];
            var alpha = this.bitmap.data[idx + 3];
            var avg = (red + green + blue) / 3;
            if (avg > 110) {
                this.bitmap.data[idx] = 255
                this.bitmap.data[idx + 1] = 255
                this.bitmap.data[idx + 2] = 255
            } else {
                this.bitmap.data[idx] = 0
                this.bitmap.data[idx + 1] = 0
                this.bitmap.data[idx + 2] = 0
            }
        })
        image.crop(parseInt(data.x), parseInt(data.y), parseInt(data.width), parseInt(data.height));
        image.write(processedImagePath + fileName);
    }).catch(function (err) {
        console.log(err);
    });
}

exports.doScan = function (req, res, position,imglocation,cb) {

    //var filePath = position;
    var data;
  //  var imagePath = filePath;
    console.log('image path',imglocation);
    var processedImagePath = __dirname + '/processed/';
    // var cropPositions = [
    //     { "x": 18, "y": 111, "width": 422, "height": 78 },
    //     { "x": 716, "y": "135", "width": 205, "height": 44 },
    //     { "x": 315, "y": 346, "width": 256, "height": 52 },
    //     { "x": 209, "y": 78, "width": 241, "height": 34 }
    // ];
    var cropPositions = position.vertex;
    console.log(cropPositions.length);
    for (var i = 0; i < cropPositions.length; i++) {
        console.log('for loop');
        loop(imglocation, i, cropPositions[i]);
    }
    return cb(true);
}

exports.fetchDataByTesseract = function (req, res, cb) {
    var pathArray = [];
    var payload = [];
    for (var i = 0; i <= 3; i++) {
        var path = __dirname + '/processed/image' + i + '.jpg';
        pathArray.push(path);
    }
    new Promise((resolve, reject) => {
        var count = 0;
        for (var j = 0; j < pathArray.length; j++) {
            Tesseract.recognize(pathArray[j])
                .then(function (result) {
                    data = result.text;
                    payload.push(data);
                    count++;
                    if (count == pathArray.length) {
                        resolve("Completed");
                    }
                })
        }
    }).then((e) => {
        console.log(e);
        res.send({ "payload": payload });

    })
}

exports.fetchDataByVision = function (req, res, cb) {
    var pathArray = [];
    var payload = [];
    for (var i = 0; i <= 3; i++) {
        var path = __dirname + '/processed/image' + i + '.jpg';
        pathArray.push(path);
    }
    new Promise((resolve, reject) => {
        var count = 0;
        for (var j = 0; j < pathArray.length; j++) {
            visionClient.detectText(pathArray[j])
                .then(function (result) {
                    var visionResult = result[0];
                    var data = visionResult[0];
                    console.log('Vision Data', data);

                    payload.push(data);
                    count++;
                    if (count == pathArray.length) {
                        resolve("Completed");
                    }
                })
        }
    }).then((e) => {
        console.log(e);
        res.send({ "payload": payload });
    })
}