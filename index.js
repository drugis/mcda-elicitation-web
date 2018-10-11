'use strict';
var dbUtil = require('./node-backend/dbUtil');
console.log(dbUtil.mcdaDBUrl);
var db = require('./node-backend/db')(dbUtil.connectionConfig);
var _ = require('lodash');
var patavi = require('./node-backend/patavi');
var logger = require('./node-backend/logger');
var signin = require('signin')(db);
var WorkspaceService = require('./node-backend/workspaceService')(db);
var OrderingService = require('./node-backend/orderingService')(db);
var SubProblemService = require('./node-backend/subProblemService')(db);
var ScenarioService = require('./node-backend/scenarioService')(db);
var WorkspaceSettingsService = require('./node-backend/workspaceSettingsService')(db);

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var csurf = require('csurf');
var server;

var authenticationMethod = process.env.MCDAWEB_AUTHENTICATION_METHOD;
console.log('Authentication method: ' + authenticationMethod);

var app = express();
app
  .use(helmet())
  .use(session({
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
  }))
  .set('trust proxy', 1)
  .use(bodyParser.json({ limit: '5mb' }))
  ;

server = http.createServer(app);

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

app
  .get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  })
  .use(csurf())
  .use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    if (req.user) {
      res.cookie('LOGGED-IN-USER', JSON.stringify(_.omit(req.user, 'email', 'password')));
    }
    next();
  })
  .get('/', function(req, res) {
    if (req.user || req.session.user) {
      res.sendFile(__dirname + '/dist/index.html');
    } else {
      res.sendFile(__dirname + '/dist/signin.html');
    }
  })
  .get('/lexicon.json', function(req, res) {
    res.sendFile(__dirname + '/app/lexicon.json');
  })
  .get('/mcda-page-titles.json', function(req, res) {
    res.sendFile(__dirname + '/app/mcda-page-titles.json');
  })
  .use(express.static('dist'))
  .use(express.static('public'))
  .use('/examples', express.static(__dirname + '/examples'))
  ;

initializeRouter();

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

//Workspace settings
app.get('/workspaces/:workspaceId/workspaceSettings', WorkspaceSettingsService.getWorkspaceSettings);
app.put('/workspaces/:workspaceId/workspaceSettings', WorkspaceSettingsService.putWorkspaceSettings);

// patavi
app.post('/patavi', function(req, res, next) { // FIXME: separate routes for scales and results
  patavi.create(req.body, function(err, taskUri) {
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

app.use('/css/fonts', express.static('./dist/fonts'));

app.use(function(error, req, res, next) {
  if (error && error.type === signin.SIGNIN_ERROR) {
    res.send(401, 'login failed');
  }
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
  res.status(404).sendFile(__dirname + '/dist/error.html');
});

var port = 8080;
if (process.argv[2] === 'port' && process.argv[3]) {
  port = process.argv[3];
}

server.listen(port, function() {
  console.log('Listening on http://localhost:' + port);
});

function useSSLLogin() {
  app.get('/signin', function(req, res) {
    var clientString = req.header('X-SSL-CLIENT-DN');
    var emailRegex = /emailAddress=([^,]*)/;
    var email = clientString.match(emailRegex)[1];
    if (email) {
      signin.findUserByEmail(email, function(error, result) {
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



function initializeRouter() {
  var router = express.Router();
  router.get('/workspaces/:id*', WorkspaceService.requireUserIsWorkspaceOwner);
  router.post('/workspaces/:id*', WorkspaceService.requireUserIsWorkspaceOwner);
  router.delete('/workspaces/:id*', WorkspaceService.requireUserIsWorkspaceOwner);
  router.get('/workspaces/inProgress/:id', WorkspaceService.requireUserIsInProgressWorkspaceOwner);
  router.put('/workspaces/inProgress/:id', WorkspaceService.requireUserIsInProgressWorkspaceOwner);
  router.put('/workspaces/:id/ordering', WorkspaceService.requireUserIsWorkspaceOwner);
  router.put('/workspaces/:id/workspaceSettings', WorkspaceService.requireUserIsWorkspaceOwner);
  router.delete('/workspaces/inProgress/:id', WorkspaceService.requireUserIsInProgressWorkspaceOwner);
  app.use(router);
} 
