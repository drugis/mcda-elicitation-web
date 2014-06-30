var express = require('express');

var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/examples', express.static(__dirname + '/../examples'));
app.use('/app', express.static(__dirname + '/app'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html')
});

app.listen(8080);
