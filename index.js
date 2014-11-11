var conf = require('./conf');
var everyauth = require('everyauth');
var _ = require('underscore');
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    csrf = require('csrf');
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
        console.log("found user", row);
        user.fulfill(row);
      });
    });
    return user;
  })
  .redirectPath('/');

var bower_path = '/bower_components';
var app = express();
app
  .use('/bower_components', express.static(__dirname + bower_path))
  .use('/app', express.static(__dirname + '/app'))
  .use('/template', express.static(__dirname + bower_path + '/angular-foundation-assets/template'))
  .use('/examples', express.static(__dirname + '/examples'))
  .use(bodyParser())
  .use(cookieParser('very secret secret'))
  .use(session())
  .use(csrf())
  .use(everyauth.middleware());

// get csrf token
app.use(function (req, res, next) {  
  res.cookie('XSRF-TOKEN', req.session._csrf);
  next();
});

// See if user is logged in, if not redirect to signin
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

// If logged in, serve index
app.get("/index", function(req, res, next) {
  res.sendfile(__dirname + '/public/index.html');
});

// Retrieve workspace info for current user
app.get("/workspaces", function(req, res) {
  pg.connect(conf.pgConStr, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT id, owner, title, problem, defaultScenarioId from Workspace WHERE owner = $1', ['1'], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      row = result.rows[0];
      res.send(result.rows);
    });
  });
});

// Extra app.post om workspace aan te maken en die informatie naar DB te schrijven
app.post("/api/post", function (req, res){
  console.log('nodejs kant');
});

// Nog een exra app.get om workspaces bij /:id op te halen.


//FIXME: should not be needed?
app.get("/main.js", function(req, res, next) { 
  res.sendfile(__dirname + '/app/js/main.js');
});

app.listen(8080);

module.exports = app;
