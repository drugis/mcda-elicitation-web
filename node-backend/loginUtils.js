var crypto = require('crypto'),
  httpStatus = require('http-status-codes'),
  logger = require('./logger');

// check if startsWith is not a language feature
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
  };
}

module.exports = {

  emailHashMiddleware: function(request, response, next) {
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
