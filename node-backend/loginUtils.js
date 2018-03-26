'use strict';
var crypto = require('crypto'),
  httpStatus = require('http-status-codes'),
  logger = require('./logger');

module.exports = {

  emailHashMiddleware: function(request, response) {
    logger.debug('loginUtils.emailHashMiddleware; request.headers.host = ' + (request.headers ? request.headers.host : 'unknown host'));
    if (!request.session.auth) {
      response.status = httpStatus.FORBIDDEN;
    } else {
      var md5Hash = crypto.createHash('md5').update(request.session.auth.google.user.email).digest('hex');
      response.json({
        name: request.session.auth.google.user.name,
        md5Hash: md5Hash
      });
    }
    //  next(); //FIXME: mcda node does not call next, it should
  }
};