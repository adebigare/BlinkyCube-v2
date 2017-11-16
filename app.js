var express = require('express');
var app = express();
var tessel = require('tessel');
var path = require('path');
var static = require('express-static');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(static(path.join(__dirname, 'static'), {
  index: true
}));