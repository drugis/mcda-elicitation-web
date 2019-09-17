'use strict';
var fs = require('fs');
var https = require('https');
var async = require('async');
var dbUtil = require('./node-backend/dbUtil');
console.log(dbUtil.mcdaDBUrl);
var db = require('./node-backend/db')(dbUtil.connectionConfig);
var _ = require('lodash');
var patavi = require('./node-backend/patavi');
var logger = require('./node-backend/logger');
var httpStatus = require('http-status-codes');
var appEnvironmentSettings = {
  googleKey: process.env.MCDAWEB_GOOGLE_KEY,
  googleSecret: process.env.MCDAWEB_GOOGLE_SECRET,
  host: process.env.MCDA_HOST
};
var signin = require('signin')(db, appEnvironmentSettings);
var InProgressWorkspaceRepository = require('./node-backend/inProgressWorkspaceRepository')(db);
var WorkspaceRepository = require('./node-backend/workspaceRepository')(db);
var WorkspaceRouter = require('./node-backend/workspaceRouter')(db);
var InProgressRouter = require('./node-backend/inProgressRouter')(db);
var OrderingRouter = require('./node-backend/orderingRouter')(db);
var SubProblemRouter = require('./node-backend/subProblemRouter')(db);
var ScenarioRouter = require('./node-backend/scenarioRouter')(db);
var WorkspaceSettingsRouter = require('./node-backend/workspaceSettingsRouter')(db);

var rightsManagement = require('rights-management')();

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var csurf = require('csurf');
var server;

var authenticationMethod = process.env.MCDAWEB_AUTHENTICATION_METHOD;

var sessionOptions = {
  store: new (require('connect-pg-simple')(session))({
    conString: dbUtil.mcdaDBUrl,
  }),
  secret: process.env.MCDAWEB_COOKIE_SECRET,
  resave: true,
  proxy: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
    secure: authenticationMethod === 'SSL'
  }
};

function makeRights(path, method, requiredRight, checkRights) {
  return {
    path: path,
    method: method,
    requiredRight: requiredRight,
    checkRights: checkRights
  };
}

rightsManagement.setRequiredRights([
  makeRights('/patavi', 'POST', 'none'),
  makeRights('/workspaces', 'GET', 'none'),
  makeRights('/workspaces', 'POST', 'none'),

  makeRights('/workspaces/:workspaceId', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId', 'POST', 'write', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId', 'DELETE', 'owner', workspaceOwnerRightsNeeded),

  makeRights('/inProgress', 'GET', 'none', inProgressOwnerRightsNeeded),
  makeRights('/inProgress', 'POST', 'none', inProgressOwnerRightsNeeded),
  makeRights('/inProgress/:workspaceId', 'GET', 'none', inProgressOwnerRightsNeeded),
  makeRights('/inProgress/:workspaceId', 'PUT', 'none', inProgressOwnerRightsNeeded),
  makeRights('/inProgress/:workspaceId', 'DELETE', 'none', inProgressOwnerRightsNeeded),

  makeRights('/workspaces/:workspaceId/ordering', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/ordering', 'PUT', 'write', workspaceOwnerRightsNeeded),

  makeRights('/workspaces/:workspaceId/workspaceSettings', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/workspaceSettings', 'PUT', 'write', workspaceOwnerRightsNeeded),

  makeRights('/workspaces/:workspaceId/problems', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems/:subProblemId', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems', 'POST', 'write', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems/:subProblemId', 'POST', 'write', workspaceOwnerRightsNeeded),

  makeRights('/workspaces/:workspaceId/scenarios', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems/:subProblemId/scenarios', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems/:subProblemId/scenarios/:scenarioId', 'GET', 'read', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems/:subProblemId/scenarios', 'POST', 'write', workspaceOwnerRightsNeeded),
  makeRights('/workspaces/:workspaceId/problems/:subProblemId/scenarios/:scenarioId', 'POST', 'write', workspaceOwnerRightsNeeded)
]);

function workspaceOwnerRightsNeeded(response, next, workspaceId, userId) {
  WorkspaceRepository.get(workspaceId, _.partial(rightsCallback, response, next, userId));
}

function inProgressOwnerRightsNeeded(response, next, workspaceId, userId) {
  InProgressWorkspaceRepository.get(workspaceId, _.partial(rightsCallback, response, next, userId));
}

function rightsCallback(response, next, userId, error, result) {
  if (error) {
    next(error);
  } else {
    var workspace = result.rows[0];
    if (!workspace) {
      response.status(httpStatus.NOT_FOUND).send('Workspace not found');
    } else if (workspace.owner !== userId) {
      response.status(httpStatus.FORBIDDEN).send('Insufficient user rights');
    } else {
      next();
    }
  }
}

function checkDBConnection(callback) {
  db.query('SELECT version() AS postgresql_version', [], function (error) {
    if (error) {
      callback(null, error);
    } else {
      console.log('Connection to database successful');
      callback();
    }
  });
}

function checkCertificates(callback) {
  var startupErrors = [];
  var httpsOptions = {
    hostname: process.env.PATAVI_HOST,
    port: process.env.PATAVI_PORT
  };

  var allCertificatesPresent = true;
  if (!fs.existsSync(process.env.PATAVI_CLIENT_KEY)) {
    startupErrors.push('Patavi client key not found at: ' + process.env.PATAVI_CLIENT_KEY);
    allCertificatesPresent = false;
  }
  if (!fs.existsSync(process.env.PATAVI_CLIENT_CRT)) {
    startupErrors.push('Patavi client certificate not found at: ' + process.env.PATAVI_CLIENT_CRT);
    allCertificatesPresent = false;
  }
  if (!fs.existsSync(process.env.PATAVI_CA)) {
    startupErrors.push('Patavi certificate authority not found at: ' + process.env.PATAVI_CA);
    allCertificatesPresent = false;
  }

  if (allCertificatesPresent) {
    console.log('All certificates found');
    httpsOptions.key = fs.readFileSync(process.env.PATAVI_CLIENT_KEY);
    httpsOptions.cert = fs.readFileSync(process.env.PATAVI_CLIENT_CRT);
    httpsOptions.ca = fs.readFileSync(process.env.PATAVI_CA);

    var postReq = https.request(httpsOptions, function (res) {
      if (res.statusCode === httpStatus.OK) {
        console.log('Connection to Patavi server successful');
      }
    });
    postReq.on('error', function (error) {
      startupErrors.push('Connection to Patavi unsuccessful: ' + error);
      postReq.end();
      callback(null, startupErrors);
    });
    postReq.end();
    callback();
  } else {
    callback(null, startupErrors);
  }
}

function runStartupDiagnostics() {
  const asyncCall = async.applyEach([checkDBConnection, checkCertificates]);
  asyncCall((error, results) => {
    if (error) {
      console.error(error);
    }
    if (results[0] || results[1]) {
      _.forEach(results, function (message) {
        if (message) {
          console.error(message);
        }
      });
      initError();
    } else {
      initApp();
    }
  });
}

var app = express();

app.use(helmet());
app.use(session(sessionOptions));
app.set('trust proxy', 1);
app.use(bodyParser.json({
  limit: '5mb'
}));

server = http.createServer(app);

runStartupDiagnostics();

function initApp() {
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
  console.log('Authentication method: ' + authenticationMethod);

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  app.use(csurf());
  app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    if (req.user) {
      res.cookie('LOGGED-IN-USER', JSON.stringify(_.omit(req.user, 'email', 'password')));
    }
    next();
  });
  app.get('/', function (req, res) {
    if (req.user || req.session.user) {
      res.sendFile(__dirname + '/dist/index.html');
    } else {
      res.sendFile(__dirname + '/dist/signin.html');
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
  app.use('/tutorials', express.static(__dirname + '/examples/tutorial-examples'));
  app.use('/css/fonts', express.static('./dist/fonts'));
  app.use(rightsManagement.expressMiddleware);

  app.use('/inProgress', InProgressRouter);
  app.use('/workspaces', WorkspaceRouter);
  app.use('/workspaces', OrderingRouter);
  app.use('/workspaces', SubProblemRouter);
  app.use('/workspaces', ScenarioRouter);
  app.use('/workspaces', WorkspaceSettingsRouter);

  app.post('/patavi', function (req, res, next) { // FIXME: separate routes for scales and results
    patavi.create(req.body, function (err, taskUri) {
      if (err) {
        logger.error(err);
        return next({
          err: err,
          status: httpStatus.INTERNAL_SERVER_ERROR
        });
      }
      res.location(taskUri);
      res.status(httpStatus.CREATED);
      res.json({
        'href': taskUri
      });
    });
  });

  app.use((error, request, response, next) => {
    logger.error(JSON.stringify(error.message, null, 2));
    if (error && error.type === signin.SIGNIN_ERROR) {
      response.send(httpStatus.UNAUTHORIZED, 'login failed');
    } else {
      response
        .status(error.status || error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
        .send(error.err ? error.err.message : error.message);
    }
    next();
  });

  //The 404 Route (ALWAYS Keep this as the last route)
  app.get('*', function (req, res) {
    res.status(httpStatus.NOT_FOUND).sendFile(__dirname + '/dist/error.html');
  });

  var port = 3002;
  if (process.argv[2] === 'port' && process.argv[3]) {
    port = process.argv[3];
  }

  server.listen(port, function () {
    console.log('Listening on http://localhost:' + port);
  });
}

function initError() {
  app.get('*', function (req, res) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).sendFile(__dirname + '/app/failedDiagnostics.html');
  });
  var port = 3002;
  if (process.argv[2] === 'port' && process.argv[3]) {
    port = process.argv[3];
  }

  server.listen(port, function () {
    console.log('Listening on http://localhost:' + port);
  });
}

function useSSLLogin() {
  app.get('/signin', function (req, res) {
    var clientString = req.header('X-SSL-CLIENT-DN');
    var emailRegex = /emailAddress=([^,]*)/;
    var email = clientString.match(emailRegex)[1];
    if (email) {
      signin.findUserByEmail(email, function (error, result) {
        if (error) {
          logger.error(error);
        } else {
          req.session.user = result;
          req.session.save();
          res.redirect('/');
        }
      });
    }
  });
}