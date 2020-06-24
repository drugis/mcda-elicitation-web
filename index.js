'use strict';
var dbUtil = require('./node-backend/dbUtil');
var _ = require('lodash');
var db = require('./node-backend/db')(dbUtil.connectionConfig);
var logger = require('./node-backend/logger');
logger.info(dbUtil.mcdaDBUrl);
var httpStatus = require('http-status-codes');
var appEnvironmentSettings = {
  googleKey: process.env.MCDAWEB_GOOGLE_KEY,
  googleSecret: process.env.MCDAWEB_GOOGLE_SECRET,
  host: process.env.MCDA_HOST
};
var signin = require('signin')(db, appEnvironmentSettings);
var InProgressWorkspaceRepository = require('./node-backend/inProgressWorkspaceRepository')(
  db
);
var WorkspaceRepository = require('./node-backend/workspaceRepository')(db);
var WorkspaceRouter = require('./node-backend/workspaceRouter')(db);
var InProgressRouter = require('./node-backend/inProgressRouter')(db);
var InProgressRouter2 = require('./node-backend/inProgressRouter2').default(db);
var OrderingRouter = require('./node-backend/orderingRouter')(db);
var patavi = require('./node-backend/patavi');
var SubProblemRouter = require('./node-backend/subProblemRouter')(db);
var ScenarioRouter = require('./node-backend/scenarioRouter')(db);
var WorkspaceSettingsRouter = require('./node-backend/workspaceSettingsRouter')(
  db
);

var StartupDiagnostics = require('startup-diagnostics')(db, logger, 'MCDA');
var rightsManagement = require('rights-management')();
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var csurf = require('csurf');
var server;

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

StartupDiagnostics.runStartupDiagnostics((errorBody) => {
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

  app.get('/logout', function (request, response) {
    request.logout();
    request.session.destroy(function (error) {
      response.redirect('/');
    });
  });
  app.use(csurf());
  app.use(function (request, response, next) {
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
  app.get('/lexicon.json', function (req, res) {
    res.sendFile(__dirname + '/app/lexicon.json');
  });
  app.get('/mcda-page-titles.json', function (req, res) {
    res.sendFile(__dirname + '/app/mcda-page-titles.json');
  });
  app.use(express.static('dist'));
  app.use(express.static('public'));
  app.use('/examples', express.static(__dirname + '/examples'));
  app.use(
    '/tutorials',
    express.static(__dirname + '/examples/tutorial-examples')
  );
  app.use('/css/fonts', express.static('./dist/fonts'));
  app.use(rightsManagement.expressMiddleware);

  app.use('/inProgress', InProgressRouter);
  app.use('/api/v2/inProgress', InProgressRouter2);
  app.use('/workspaces', WorkspaceRouter);
  app.use('/workspaces', OrderingRouter);
  app.use('/workspaces', SubProblemRouter);
  app.use('/workspaces', ScenarioRouter);
  app.use('/workspaces', WorkspaceSettingsRouter);

  app.post('/patavi', pataviHandler);

  app.use(errorHandler);

  //The 404 Route (ALWAYS Keep this as the last route)
  app.get('*', function (req, res) {
    res.status(httpStatus.NOT_FOUND).sendFile(__dirname + '/dist/error.html');
  });

  startListening(function (port) {
    logger.info('Listening on http://localhost:' + port);
  });
}

function pataviHandler(request, response, next) {
  // FIXME: separate routes for scales and results
  patavi.create(request.body, function (error, taskUri) {
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

function errorHandler(error, request, response, next) {
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

function initError(errorBody) {
  app.get('*', function (request, response) {
    response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .set('Content-Type', 'text/html')
      .send(errorBody);
  });

  startListening(function (port) {
    logger.error('Access the diagnostics summary at http://localhost:' + port);
  });
}

function startListening(listenFunction) {
  var port = 3002;
  if (process.argv[2] === 'port' && process.argv[3]) {
    port = process.argv[3];
  }
  server.listen(port, _.partial(listenFunction, port));
}

function makeRights(path, method, requiredRight, checkRights) {
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

    makeRights('/inProgress', 'GET', 'none', inProgressOwnerRightsNeeded),
    makeRights('/inProgress', 'POST', 'none', inProgressOwnerRightsNeeded),
    makeRights(
      '/inProgress/:workspaceId',
      'GET',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/inProgress/:workspaceId',
      'PUT',
      'none',
      inProgressOwnerRightsNeeded
    ),
    makeRights(
      '/inProgress/:workspaceId',
      'DELETE',
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

function workspaceOwnerRightsNeeded(response, next, workspaceId, userId) {
  WorkspaceRepository.get(
    workspaceId,
    _.partial(rightsCallback, response, next, userId)
  );
}

function inProgressOwnerRightsNeeded(response, next, workspaceId, userId) {
  InProgressWorkspaceRepository.get(
    workspaceId,
    _.partial(rightsCallback, response, next, userId)
  );
}

function rightsCallback(response, next, userId, error, result) {
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
      signin.findUserByEmail(email, function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          request.session.user = result;
          request.session.save();
          response.redirect('/');
        }
      });
    }
  });
}
