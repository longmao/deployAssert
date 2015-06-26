var express = require('express');
var app = express();
var router = express.Router();
var util = require('./util')();
var conf = require('./conf')()

util.glob(conf.API_JS_FILE, function(data) {
});


function sendHtmlData(filename, res) {
	filename = conf.APP_FOLDER + "/" + filename
    util.glob(filename, function(data) {
        res.send(data);
    });
}
app.get('/', function(req, res) {
    var filename = "index.html"
    sendHtmlData(filename, res)

});

app.get('/:filename.html', function(req, res) {
    var filename = req.params.filename + ".html"
    sendHtmlData(filename, res)
});

app.use(express.static(conf.APP_FOLDER));


var server = app.listen(3000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
