'use strict';
var loginUtils = require('./node-backend/loginUtils');
var dbUri = 'postgres://' + process.env.MCDAWEB_DB_USER + ':' + process.env.MCDAWEB_DB_PASSWORD + '@' + process.env.MCDAWEB_DB_HOST + '/' + process.env.MCDAWEB_DB_NAME; // FIXME
console.log(dbUri);
var db = require('./node-backend/db')(dbUri);
var patavi = require('./node-backend/patavi');
var logger = require('./node-backend/logger');
var UserManagement = require('./node-backend/userManagement')(db);
var WorkspaceService = require('./node-backend/workspaceService')(db);
var OrderingService = require('./node-backend/orderingService')(db);
var ToggledColumnService = require('./node-backend/toggledColumnService')(db);
var SubProblemService = require('./node-backend/subProblemService')(db);
var ScenarioService = require('./node-backend/scenarioService')(db);
var http = require('http');
var https = require('https');
var fs = require('fs');
var server;

var express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  helmet = require('helmet'),
  csurf = require('csurf');

var app = express();
app
  .use(helmet())
  .use(session({
    store: new (require('connect-pg-simple')(session))({
      conString: dbUri,
    }),
    secret: process.env.MCDAWEB_COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.MCDAWEB_USE_SSL_AUTH,
      maxAge: new Date(Date.now() + 3600000)
    }
  }));

if (process.env.MCDAWEB_USE_SSL_AUTH) {
  app.set('trust proxy', 1);
  server = http.createServer(app);
  app.get('/signin', function (req, res) {
    var clientString = req.header('X-SSL-CLIENT-DN');
    var emailRegex = /emailAddress=([^,]*)/;
    var email = clientString.match(emailRegex)[1];
    if (email) {
      UserManagement.findUserByEmail(email, function (err, result) {
        if (err) {
          logger.error(err);
        } else {
          req.session.user = result;
          req.session.save();
          res.redirect('/');
        }
      });
    }
  });
} else {
  server = http.createServer(app);
  var everyauth = require('everyauth');
  everyauth.everymodule.findUserById(UserManagement.findUserById);
  everyauth.google
    .myHostname(process.env.MCDA_HOST)
    .authQueryParam({
      approval_prompt: 'auto'
    })
    .appId(process.env.MCDAWEB_GOOGLE_KEY)
    .appSecret(process.env.MCDAWEB_GOOGLE_SECRET)
    .scope('https://www.googleapis.com/auth/userinfo.profile email')
    .findOrCreateUser(UserManagement.findOrCreateUser)
    .redirectPath('/');
  app.get('/signin', function (req, res) {
    res.sendFile(__dirname + '/public/signin.html');
  });
}

var bower_path = '/bower_components';
app
  .use(express.static('manual'))
  .use('/bower_components', express.static(__dirname + '/bower_components'))
  .use(express.static('app'))
  .use('/template', express.static(__dirname + bower_path + '/angular-foundation-assets/template'))
  .use('/examples', express.static(__dirname + '/examples'))
  .use(bodyParser.json())
  .use(csurf());
  if (!process.env.MCDAWEB_USE_SSL_AUTH) {
  app.use(everyauth.middleware(app));
}


var router = express.Router();
router.get('/workspaces/:id*', WorkspaceService.requireUserIsWorkspaceOwner);
router.post('/workspaces/:id*', WorkspaceService.requireUserIsWorkspaceOwner);
router.delete('/workspaces/:id*', WorkspaceService.requireUserIsWorkspaceOwner);
router.get('/workspaces/inProgress/:id', WorkspaceService.requireUserIsInProgressWorkspaceOwner);
router.put('/workspaces/inProgress/:id', WorkspaceService.requireUserIsInProgressWorkspaceOwner);
router.put('/workspaces/:id/ordering', WorkspaceService.requireUserIsWorkspaceOwner);
router.put('/workspaces/:id/toggledColumns', WorkspaceService.requireUserIsWorkspaceOwner);
router.delete('/workspaces/inProgress/:id', WorkspaceService.requireUserIsInProgressWorkspaceOwner);
app.use(router);

app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  if (req.user) {
    res.cookie('LOGGED-IN-USER', JSON.stringify(req.user));
  }
  next();
});

app.get('/', function (req, res) {
  if (req.user || req.session.user) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.redirect('/signin');
  }
});

// Workspaces in progress
app.post('/inProgress', WorkspaceService.createInProgress);
app.put('/inProgress/:id', WorkspaceService.updateInProgress);
app.get('/inProgress/:id', WorkspaceService.getInProgress);
app.get('/inProgress', WorkspaceService.queryInProgress);
app.delete('/inProgress/:id', WorkspaceService.deleteInProgress);

// Complete workspaces
app.get('/workspaces', WorkspaceService.queryWorkspaces);
app.post('/workspaces', WorkspaceService.createWorkspace);
app.get('/workspaces/:id', WorkspaceService.getWorkspace);
app.post('/workspaces/:id', WorkspaceService.updateWorkspace);
app.delete('/workspaces/:id', WorkspaceService.deleteWorkspace);

// Orderings
app.get('/workspaces/:workspaceId/ordering', OrderingService.getOrdering);
app.put('/workspaces/:workspaceId/ordering', OrderingService.updateOrdering);

//Effects table non-alternative columns
app.get('/workspaces/:workspaceId/toggledColumns', ToggledColumnService.getToggledColumns);

app.put('/workspaces/:workspaceId/toggledColumns', ToggledColumnService.updateToggledColumns);

//Subproblems
app.get('/workspaces/:workspaceId/problems', SubProblemService.querySubProblems);
app.get('/workspaces/:workspaceId/problems/:subProblemId', SubProblemService.getSubProblem);
app.post('/workspaces/:workspaceId/problems', SubProblemService.createSubProblem);
app.post('/workspaces/:workspaceId/problems/:subProblemId', SubProblemService.updateSubProblem);

//Scenarios
app.get('/workspaces/:workspaceId/scenarios', ScenarioService.queryScenarios);
app.get('/workspaces/:workspaceId/problems/:subProblemId/scenarios', ScenarioService.queryScenariosForSubProblem);
app.get('/workspaces/:workspaceId/problems/:subProblemId/scenarios/:id', ScenarioService.getScenario);
app.post('/workspaces/:workspaceId/problems/:subProblemId/scenarios', ScenarioService.createScenario);
app.post('/workspaces/:workspaceId/problems/:subProblemId/scenarios/:id', ScenarioService.updateScenario);

// patavi
app.post('/patavi', function (req, res, next) { // FIXME: separate routes for scales and results
  patavi.create(req.body, function (err, taskUri) {
    if (err) {
      logger.error(err);
      return next({
        err: err,
        status: 500
      });
    }
    res.location(taskUri);
    res.status(201);
    res.json({
      'href': taskUri
    });
  });
});

app.get('/user', loginUtils.emailHashMiddleware);

//FIXME: should not be needed?
app.get('/main.js', function (req, res) {
  res.sendFile(__dirname + '/app/js/main.js');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.status(404).sendFile(__dirname + '/public/error.html');
});

var port = 8080;
if (process.argv[2] === 'port' && process.argv[3]) {
  port = process.argv[3];
}

server.listen(port, function () {
  console.log('Listening on http://localhost:' + port);
});