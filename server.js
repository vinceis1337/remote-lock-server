/**
 * Created by Vincent Liao on 2017/03/12
 */

var providedKey = '';
var port = 8080;
var augustPort = 1;

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');

var app = express();

app.use(bodyParser.json());

app.post('/augustlock', function (req, res) {
    if (req.headers['key'] == providedKey) {
        console.log("Authorized Attempt Received.")
        var urlRequestString = 'http://localhost:' + augustPort + '/august/control/';
        urlRequestString += req.body.command;
        console.log("Command: " + urlRequestString)
        request(urlRequestString, function (error, response, body) {
            res.send(response.body);
        })
    } else {
        console.log("Unauthorized Attempt Received.")
    }
});

//Kills the Node
app.post('/kill', function (req, res) {
    if (req.headers['key'] == providedKey) {
        console.log("Emergency Kill Received.")
        res.send('{"server": "killed"}');
        process.exit();
    } else {
        console.log("Unauthorized Attempt Received.")
    }
});

//Instantiate the Server
app.use(express.static(__dirname));
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});