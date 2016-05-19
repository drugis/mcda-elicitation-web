'use strict';
var fs = require('fs');
var https = require('https');
var logger = require('./logger');
var _ = require('underscore');


var httpsOptions = {
  hostname: process.env.PATAVI_HOST,
  port: process.env.PATAVI_PORT,
  key: fs.readFileSync(process.env.PATAVI_CLIENT_KEY),
  cert: fs.readFileSync(process.env.PATAVI_CLIENT_CRT),
  ca: fs.readFileSync(process.env.PATAVI_CA)
};

function createPataviTask(problem, callback) {
  logger.debug('pataviTaskRepository.createPataviTask');
  var reqOptions = {
    path: '/task?service=smaa_v2&ttl=PT5M',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  var postReq = https.request(_.extend(httpsOptions, reqOptions), function(res) {
    if (res.statusCode === 201 && res.headers.location) {
      callback(null, res.headers.location);
    } else {
      callback('Error queueing task: server returned code ' + res.statusCode);
    }
  });
  postReq.write(JSON.stringify(problem));
  postReq.end();
}

module.exports = {
  create: createPataviTask
};
