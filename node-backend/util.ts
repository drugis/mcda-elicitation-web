import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {logger} from './logger';

export function getUser(req: any) {
  if (req.user) {
    return req.user;
  }
  if (req.session.user) {
    return req.session.user;
  }
}

export function handleError(error: any, next: any) {
  logger.error(JSON.stringify(error, null, 2));
  next({
    statusCode: error.statusCode || INTERNAL_SERVER_ERROR,
    message: error.message || error
  });
}
