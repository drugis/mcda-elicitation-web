import IError from '@shared/interface/IError';
import bodyParser from 'body-parser';
import csurf from 'csurf';
import express, {Request, Response} from 'express';
import session from 'express-session';
import helmet from 'helmet';
import http from 'http';
import httpStatus from 'http-status-codes';
import _ from 'lodash';
import 'module-alias/register';
// @ts-ignore
import RightsManagement from 'rights-management';
// @ts-ignore
import Signin from 'signin';
// @ts-ignore
import StartupDiagnostics from 'startup-diagnostics';
import DB from './node-backend/db';
import dbUtil from './node-backend/dbUtil';
import InProgressRouter from './node-backend/inProgressRouter';
import InProgressWorkspaceRepository from './node-backend/inProgressWorkspaceRepository';
import {logger} from './node-backend/loggerTS';
import OrderingRouter from './node-backend/orderingRouter';
import patavi from './node-backend/patavi';
import ScenarioRouter from './node-backend/scenarioRouter';
import SubProblemRouter from './node-backend/subProblemRouter';
import WorkspaceRepository from './node-backend/workspaceRepository';
import WorkspaceRouter from './node-backend/workspaceRouter';
import WorkspaceSettingsRouter from './node-backend/workspaceSettingsRouter';

const db = DB(dbUtil.connectionConfig);

logger.info(dbUtil.mcdaDBUrl);

var appEnvironmentSettings = {
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

const subProblemRouter = SubProblemRouter(db);
const scenarioRouter = ScenarioRouter(db);

const workspaceSettingsRouter = WorkspaceSettingsRouter(db);

const startupDiagnostics = StartupDiagnostics(db, logger, 'MCDA');

const rightsManagement = RightsManagement();
let server: http.Server;

var authenticationMethod = process.env.MCDAWEB_AUTHENTICATION_METHOD;

var app = express();
app.use(helmet());
app.set('trust proxy', 1);
app.use(
  bodyParser.json({
    limit: '5mb'
  })
);
server = http.createServer(app);

startupDiagnostics.runStartupDiagnostics((errorBody: IError | null) => {
  if (errorBody) {
    initError(errorBody);
  } else {
    initApp();
  }
});

function initApp() {
  setRequiredRights();
  var sessionOptions = {
    store: new (require('connect-pg-simple')(session))({
      conString: dbUtil.mcdaDBUrl
    }),
    secret: process.env.MCDAWEB_COOKIE_SECRET,
    resave: false,
    proxy: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: authenticationMethod === 'SSL'
    }
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

  app.get('/logout', function (request: Request, response: Response) {
    request.logout();
    request.session.destroy(function (error) {
      response.redirect('/');
    });
  });
  app.use(csurf());
  app.use(function (request: Request, response, next) {
    response.cookie('XSRF-TOKEN', request.csrfToken());
    if (request.user) {
      response.cookie(
        'LOGGED-IN-USER',
        JSON.stringify(_.omit(request.user, 'email', 'password'))
      );
    }
    next();
  });
  app.get('/', function (request, response) {
    if (request.user || request.session.user) {
      response.sendFile(__dirname + '/dist/index.html');
    } else {
      response.sendFile(__dirname + '/dist/signin.html');
    }
  });
  app.use(express.static(__dirname + '/dist'));
  app.use(express.static('public'));
  app.use('/examples', express.static('examples'));
  app.use('/tutorials', express.static('examples/tutorial-examples'));
  app.use('/css/fonts', express.static(__dirname + '/dist/fonts'));
  app.use(rightsManagement.expressMiddleware);

  app.use('/api/v2/inProgress', inProgressRouter);
  app.use('/workspaces', workspaceRouter);
  app.use('/workspaces', orderingRouter);
  app.use('/workspaces', subProblemRouter);
  app.use('/workspaces', scenarioRouter);
  app.use('/workspaces', workspaceSettingsRouter);

  app.post('/patavi', pataviHandler);

  app.use(errorHandler);

  //The 404 Route (ALWAYS Keep this as the last route)
  app.get('*', function (req, res) {
    res.status(httpStatus.NOT_FOUND).sendFile(__dirname + '/dist/error.html');
  });

  startListening(function (port: string) {
    logger.info('Listening on http://localhost:' + port);
  });
}

function pataviHandler(request: Request, response: Response, next: any) {
  // FIXME: separate routes for scales and results
  patavi.create(request.body, function (error: IError | null, taskUri: string) {
    if (error) {
      logger.error(error);
      return next({
        message: error,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR
      });
    }
    response.location(taskUri);
    response.status(httpStatus.CREATED);
    response.json({
      href: taskUri
    });
  });
}

function errorHandler(
  error: IError | null,
  request: Request,
  response: Response,
  next: any
) {
  logger.error(JSON.stringify(error.message, null, 2));
  if (error && error.type === signin.SIGNIN_ERROR) {
    response.status(httpStatus.UNAUTHORIZED).send('login failed');
  } else if (error) {
    response
      .status(
        error.status || error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
      )
      .send(error.err ? error.err.message : error.message);
  } else {
    next();
  }
}

function initError(errorBody: object) {
  app.get('*', function (request, response) {
    response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .set('Content-Type', 'text/html')
      .send(errorBody);
  });

  startListening((port: string) => {
    logger.error('Access the diagnostics summary at http://localhost:' + port);
  });
}

function startListening(listenFunction: (port: string) => void) {
  let port = '3002';
  if (process.argv[2] === 'port' && process.argv[3]) {
    port = process.argv[3];
  }
  server.listen(port, _.partial(listenFunction, port));
}

function makeRights(
  path: string,
  method: string,
  requiredRight: string,
  checkRights?: (
    response: Response,
    next: any,
    workspaceId: number,
    userId: number
  ) => void
) {
  return {
    path: path,
    method: method,
    requiredRight: requiredRight,
    checkRights: checkRights
  };
}

function setRequiredRights() {
  rightsManagement.setRequiredRights([
    makeRights('/patavi', 'POST', 'none'),
    makeRights('/workspaces', 'GET', 'none'),
    makeRights('/workspaces', 'POST', 'none'),

    makeRights(
      '/workspaces/:workspaceId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId',
      'DELETE',
      'owner',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/api/v2/inProgress',
      'GET',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress',
      'POST',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId',
      'GET',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/criteria/:criterionId/dataSources/:dataSourceId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/alternatives/:alternativeId',
      'DELETE',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/cells',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/:inProgressId/doCreateWorkspace',
      'POST',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/api/v2/inProgress/createCopy',
      'POST',
      'none',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/ordering',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/ordering',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/workspaceSettings',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/workspaceSettings',
      'PUT',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/problems',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId',
      'DELETE',
      'write',
      workspaceOwnerRightsNeeded
    ),

    makeRights(
      '/workspaces/:workspaceId/scenarios',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId/scenarios',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId/scenarios/:scenarioId',
      'GET',
      'read',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId/scenarios',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subProblemId/scenarios/:scenarioId',
      'POST',
      'write',
      workspaceOwnerRightsNeeded
    ),
    makeRights(
      '/workspaces/:workspaceId/problems/:subproblemId/scenarios/:scenarioId',
      'DELETE',
      'write',
      workspaceOwnerRightsNeeded
    )
  ]);
}

function workspaceOwnerRightsNeeded(
  response: Response,
  next: any,
  workspaceId: number,
  userId: number
) {
  workspaceRepository.get(
    workspaceId,
    _.partial(rightsCallback, response, next, userId)
  );
}

function inProgressOwnerRightsNeeded(
  response: Response,
  next: any,
  workspaceId: number,
  userId: number
) {
  inProgressWorkspaceRepository.get(
    workspaceId,
    _.partial(rightsCallback, response, next, userId)
  );
}

function rightsCallback(
  response: Response,
  next: any,
  userId: number,
  error: IError | null,
  result: any
) {
  if (error) {
    next(error);
  } else {
    var workspace = result;
    if (!workspace) {
      response.status(httpStatus.NOT_FOUND).send('Workspace not found');
    } else if (workspace.owner !== userId) {
      response.status(httpStatus.FORBIDDEN).send('Insufficient user rights');
    } else {
      next();
    }
  }
}

function useSSLLogin() {
  app.get('/signin', function (request, response) {
    var clientString = request.header('X-SSL-CLIENT-DN');
    var emailRegex = /emailAddress=([^,]*)/;
    var email = clientString.match(emailRegex)[1];
    if (email) {
      signin.findUserByEmail(email, function (
        error: IError | null,
        result: any
      ) {
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
