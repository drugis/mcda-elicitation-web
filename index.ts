/* eslint-disable react-hooks/rules-of-hooks */
import {OurError} from '@shared/interface/IError';
import csurf from 'csurf';
import express, {CookieOptions, Request, Response} from 'express';
import session, {SessionOptions} from 'express-session';
import helmet from 'helmet';
import http from 'http';
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED
} from 'http-status-codes';
import _ from 'lodash';
import 'module-alias/register';
// @ts-ignore
import RightsManagement from 'rights-management';
// @ts-ignore
import Signin from 'signin';
// @ts-ignore
import StartupDiagnostics from 'startup-diagnostics';
import DB from './node-backend/db';
import {buildDBConfig, buildDBUrl} from './node-backend/dbUtil';
import getRequiredRights from './node-backend/getRequiredRights';
import InProgressWorkspaceRepository from './node-backend/inProgressRepository';
import InProgressRouter from './node-backend/inProgressRouter';
import logger from './node-backend/logger';
import OrderingRouter from './node-backend/orderingRouter';
import PataviRouter from './node-backend/pataviRouter';
import {premades} from './node-backend/premades';
import ScenarioRouter from './node-backend/scenarioRouter';
import SubproblemRouter from './node-backend/subproblemRouter';
import WorkspaceRepository from './node-backend/workspaceRepository';
import WorkspaceRouter from './node-backend/workspaceRouter';
import WorkspaceSettingsRouter from './node-backend/workspaceSettingsRouter';

const db = DB(buildDBConfig());

logger.info(buildDBUrl());

const appEnvironmentSettings = {
  googleKey: process.env.MCDAWEB_GOOGLE_KEY,
  googleSecret: process.env.MCDAWEB_GOOGLE_SECRET,
  host: process.env.MCDA_HOST
};
const signin = Signin(db, appEnvironmentSettings);
const inProgressWorkspaceRepository = InProgressWorkspaceRepository(db);
const workspaceRepository = WorkspaceRepository(db);
const workspaceRouter = WorkspaceRouter(db);
const inProgressRouter = InProgressRouter(db);
const orderingRouter = OrderingRouter(db);
const subproblemRouter = SubproblemRouter(db);
const scenarioRouter = ScenarioRouter(db);
const workspaceSettingsRouter = WorkspaceSettingsRouter(db);
const pataviRouter = PataviRouter(db);
const startupDiagnostics = StartupDiagnostics(db, logger, 'MCDA');
const rightsManagement = RightsManagement();

let server: http.Server;
let authenticationMethod = process.env.MCDAWEB_AUTHENTICATION_METHOD;

const app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(
  express.json({
    limit: '5mb'
  })
);
server = http.createServer(app);

startupDiagnostics.runStartupDiagnostics((errorBody: OurError): void => {
  if (errorBody) {
    process.exit(1);
    // initError(errorBody);
  } else {
    initApp();
  }
});

function initApp(): void {
  rightsManagement.setRequiredRights(
    getRequiredRights(workspaceOwnerRightsNeeded, inProgressOwnerRightsNeeded)
  );
  const cookieSettings: CookieOptions = {
    maxAge: 60 * 60 * 1000, // 1 hour,
    secure: authenticationMethod === 'SSL',
    sameSite: authenticationMethod === 'SSL' ? 'strict' : 'lax'
  };
  const sessionOptions: SessionOptions = {
    store: new (require('connect-pg-simple')(session))({
      conString: buildDBUrl()
    }),
    secret: process.env.MCDAWEB_COOKIE_SECRET,
    resave: false,
    proxy: true,
    rolling: true,
    saveUninitialized: true,
    cookie: cookieSettings
  };

  app.use(session(sessionOptions));

  switch (authenticationMethod) {
    case 'SSL':
      useSSLLogin();
      break;
    case 'LOCAL':
      signin.useLocalLogin(app);
      break;
    default:
      authenticationMethod = 'GOOGLE';
      signin.useGoogleLogin(app);
  }
  logger.info('Authentication method: ' + authenticationMethod);

  app.get('/logout', (request: Request, response: Response): void => {
    request.logout();
    request.session.destroy((error) => {
      response.redirect('/');
    });
  });
  app.use(csurf());
  app.use((request: Request, response: Response, next: any): void => {
    response.cookie('XSRF-TOKEN', request.csrfToken(), cookieSettings);
    if (request.user) {
      response.cookie(
        'LOGGED-IN-USER',
        JSON.stringify(_.omit(request.user, 'email', 'password')),
        cookieSettings
      );
    }
    next();
  });
  app.get('/', (request: any, response: Response): void => {
    if (request.user || request.session.user) {
      response.sendFile(__dirname + '/dist/index.html');
    } else {
      response.sendFile(__dirname + '/dist/signin.html');
    }
  });
  app.use(express.static(__dirname + '/dist'));
  app.use(express.static('public'));
  app.use('/img', express.static('tutorials/fig'));
  app.use('/css/fonts', express.static(__dirname + '/dist/fonts'));

  app.use('/api', rightsManagement.expressMiddleware);

  app.use('/api/v2/inProgress', inProgressRouter);
  app.use('/api/v2/workspaces', workspaceRouter);
  app.use('/api/v2/workspaces', orderingRouter);
  app.use('/api/v2/workspaces', subproblemRouter);
  app.use('/api/v2/workspaces', scenarioRouter);
  app.use('/api/v2/workspaces', workspaceSettingsRouter);
  app.use('/api/v2/premades', (request: Request, response: Response) => {
    response.json(premades);
  });
  app.use('/api/v2/patavi', pataviRouter);
  app.use(errorHandler);

  // Default route (ALWAYS Keep this as the last route)
  app.get('*', (request: any, response: Response): void => {
    if (request.user || request.session.user) {
      response.sendFile(__dirname + '/dist/index.html');
    } else {
      response.sendFile(__dirname + '/dist/signin.html');
    }
  });

  startListening((port: string): void => {
    logger.info('Listening on http://localhost:' + port);
  });
}

function errorHandler(
  error: OurError,
  request: Request,
  response: Response,
  next: any
): void {
  logger.error(JSON.stringify(error.message, null, 2));
  if (error && error.type === signin.SIGNIN_ERROR) {
    response.status(UNAUTHORIZED).send('login failed');
  } else if (error) {
    const errorMessage = error.err ? error.err.message : error.message;
    response
      .status(error.status || error.statusCode || INTERNAL_SERVER_ERROR)
      .send(errorMessage);
  } else {
    next();
  }
}

function initError(errorBody: object): void {
  app.get('*', (request: Request, response: Response): void => {
    response
      .status(INTERNAL_SERVER_ERROR)
      .set('Content-Type', 'text/html')
      .send(errorBody);
  });

  startListening((port: string): void => {
    logger.error('Access the diagnostics summary at http://localhost:' + port);
  });
}

function startListening(listenFunction: (port: string) => void): void {
  let port = '3002';
  if (process.argv[2] === 'port' && process.argv[3]) {
    port = process.argv[3];
  }
  server.listen(port, _.partial(listenFunction, port));
}

function workspaceOwnerRightsNeeded(
  response: Response,
  next: any,
  workspaceId: string,
  userId: number
): void {
  workspaceRepository.get(
    workspaceId,
    _.partial(rightsCallback, response, next, userId)
  );
}

function inProgressOwnerRightsNeeded(
  response: Response,
  next: any,
  workspaceId: string,
  userId: number
): void {
  inProgressWorkspaceRepository.get(
    workspaceId,
    _.partial(rightsCallback, response, next, userId)
  );
}

function rightsCallback(
  response: Response,
  next: any,
  userId: number,
  error: OurError,
  result: any
): void {
  if (error) {
    next(error);
  } else {
    const workspace = result;
    if (!workspace) {
      response.status(NOT_FOUND).send('Workspace not found');
    } else if (workspace.owner !== userId) {
      response.status(FORBIDDEN).send('Insufficient user rights');
    } else {
      next();
    }
  }
}

function useSSLLogin(): void {
  app.get('/signin', (request: any, response: Response) => {
    const clientString = request.header('X-SSL-CLIENT-DN');
    const emailRegex = /emailAddress=([^,]*)/;
    const email = clientString.match(emailRegex)[1];
    if (email) {
      signin.findUserByEmail(email, (error: OurError, result: any) => {
        if (error) {
          logger.error(error);
        } else {
          request.session.user = result;
          request.session.save(() => {
            response.redirect('/');
          });
        }
      });
    }
  });
}
