'use strict';
import DBConfig from './interface/IDBConfig';
import logger from './logger';

export function buildDBUrl(): string {
  const env = process.env;
  const url = buildUrl(
    env.MCDAWEB_DB_HOST,
    env.MCDAWEB_DB_NAME,
    env.MCDAWEB_DB_USER,
    env.MCDAWEB_DB_PASSWORD
  );
  logger.info('MCDA db url: ' + url);
  return url;
}

export function buildDBConfig():DBConfig {
  const env = process.env;
  return {
    host: env.MCDAWEB_DB_HOST,
    user: env.MCDAWEB_DB_USER,
    database: env.MCDAWEB_DB_NAME,
    password: env.MCDAWEB_DB_PASSWORD
  };
}

function buildUrl(
  hostname: string,
  database: string,
  username: string,
  password: string
): string {
  return (
    'postgres://' + username + ':' + password + '@' + hostname + '/' + database
  );
}
