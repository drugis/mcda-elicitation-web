'use strict';
var logger = require('./logger');

module.exports = {
  mcdaDBUrl: buildMCDADBUrl(),
  connectionConfig: buildMcdaDBConnectionConfig()
};

function buildMCDADBUrl() {
  var env = process.env;
  var url = buildUrl(env.DB_HOST,
    env.MCDAWEB_DB_NAME,
    env.MCDAWEB_DB_USER,
    env.MCDAWEB_DB_PASSWORD);
  logger.info('MCDA db url: ' + url);
  return url;
}

function buildMcdaDBConnectionConfig() {
  var env = process.env;
  return {
    host: env.DB_HOST,
    user: env.MCDAWEB_DB_USER,
    database: env.MCDAWEB_DB_NAME,
    password: env.MCDAWEB_DB_PASSWORD
  };
}

function buildUrl(hostname, database, username, password) {
  return 'postgres://' + username + ':' + password + '@' + hostname + '/' + database;
}
