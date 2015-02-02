var conf = require('./conf');
var everyauth = require('everyauth');
var _ = require('underscore');

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    csurf = require('csurf');

var pg = require('pg');
var deferred = require('deferred');

everyauth.everymodule
  .findUserById(function(id, callback) {
    pg.connect(conf.pgConStr, function(error, client, done) {
      if (error) return console.error("Error fetching client from pool", error);
      client.query("SELECT id, username, firstName, lastName FROM Account WHERE id = $1", [id], function(error, result) {
        done();
        if (error) callback(error);
        else if (result.rows.length == 0) callback("ID " + id + " not found");
        else callback(null, result.rows[0]);
      });
    });
  });

everyauth.google
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.googleapis.com/auth/userinfo.profile email')
  .findOrCreateUser(function (sess, accessToken, extra, googleUser) {
    var user = this.Promise();
    pg.connect(conf.pgConStr, function(error, client, done) {
      if (error) return console.error("Error fetching client from pool", error);

      client.query("SELECT id, username, firstName, lastName FROM UserConnection LEFT JOIN Account ON UserConnection.userid = Account.username WHERE providerUserId = $1 AND providerId = 'google'", [googleUser.id], function(error, result) {
        if (error) {
          done();
          return user.fail(error);
        }
        if (result.rows.length == 0) {
          client.query("INSERT INTO UserConnection (userId, providerId, providerUserId, rank, displayName, profileUrl, accessToken, refreshToken, expireTime)" +
            " VALUES ($1, 'google', $2, 1, $3, $4, $5, $6, $7)",
            [googleUser.id, googleUser.id, googleUser.name, googleUser.link, accessToken, extra.refresh_token, extra.expires_in],
            function(error, result) {
              if (error) {
                done();
                return user.fail(error);
              }
              client.query("INSERT INTO Account (username, firstName, lastName) VALUES ($1, $2, $3) RETURNING id",
                [googleUser.id, googleUser.given_name, googleUser.family_name],
                function(error, result) {
                  done();
                  if (error)  {
                    return user.fail(error);
                  }
                  var row = result.rows[0];
                  console.log("created user", row);
                  user.fulfill({
                    "id": row.id,
                    "username": googleUser.id,
                    "firstName": googleUser.given_name,
                    "lastName": googleUser.family_name});
                });
            });
          return;
        }
        done();
        row = result.rows[0];
        user.fulfill(row);
      });
    });
    return user;
  })
  .redirectPath('/');

var bower_path = '/bower_components';
var csrfValue = function(req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);
  return token;
};
var app = express();
app
  .use('/bower_components', express.static(__dirname + bower_path))
  .use('/app', express.static(__dirname + '/app'))
  .use('/template', express.static(__dirname + bower_path + '/angular-foundation-assets/template'))
  .use('/examples', express.static(__dirname + '/examples'))
  .use(bodyParser())
  .use(cookieParser('very secret secret'))
  .use(session())
  .use(everyauth.middleware(app))
  .use(csurf({ cookie: true }));

app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  if (req.user) {
    res.cookie('LOGGED-IN-USER', JSON.stringify(req.user));
  }
  next();
});

app.get("/", function(req, res, next) {
  if (req.user) {
    res.redirect('/index');
  } else {
    res.redirect('/signin');
  }
});

app.get("/signin", function(req, res, next) {
  res.sendfile(__dirname + '/public/signin.html');
});

app.get("/index", function(req, res, next) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get("/workspaces", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT id, owner, title, problem, defaultScenarioId AS "defaultScenarioId" FROM Workspace WHERE owner = $1', [req.user.id], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result.rows);
    });
  });
});

app.post("/workspaces", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error entering workspace in pool', err);
    }
    client.query('INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id', [req.user.id, req.body.title, req.body.problem], function(err, result) {
      if(err) {
        done();
        return console.error('error running query', err);
      }
      var workspaceId = result.rows[0].id;
      client.query('INSERT INTO scenario (workspace, title, state) VALUES ($1, $2, $3) RETURNING id', [workspaceId, 'Default', { problem: req.body.problem }], function(err, result) {
        if(err) {  
        done();
          return console.error('error running query', err);
        }
        var scenarioId = result.rows[0].id;
        client.query('UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2', [scenarioId, workspaceId], function(err, result) {
          if(err) {
            done();
            return console.error('error running query', err);
          }
          client.query('SELECT id, problem::json, defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1', [workspaceId], function(err, result) {
            if(err) {
              done();
              return console.error('error running query', err);
            }
            done();
            res.send(result.rows[0]);
          });
        });
      });
    });
  });
});

app.get("/workspaces/:id", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error fetching workspace from pool', err);
    }
    client.query('SELECT id, problem::json, defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1', [req.params.id], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result.rows[0]);
    });
  });
});

app.get("/workspaces/:id/scenarios", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error fetching workspace from pool', err);
    }
    client.query('SELECT id, title, state::json, workspace AS "workspaceId" FROM scenario WHERE workspace = $1', [req.params.id], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result.rows);
    });
  });
});

app.get("/workspaces/:id/scenarios/:id", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error fetching workspace from pool', err);
    }
    client.query('SELECT id, title, state::json, workspace AS "workspaceId" FROM scenario WHERE id = $1', [req.params.id], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result.rows[0]);
    });
  });
});

app.get("/workspaces/:id/remarks", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error fetching remarks from pool', err);
    }
    client.query('SELECT workspaceid AS "workspaceId", remarks FROM remarks WHERE workspaceid = $1', [req.params.id], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result.rows[0]);
    });
  });
});

app.post("/workspaces/:id/remarks", function(req, res) {
  console.log('yo');
});

//FIXME: should not be needed?
app.get("/main.js", function(req, res, next) { 
  res.sendfile(__dirname + '/app/js/main.js');
});

app.listen(8080);

module.exports = app;