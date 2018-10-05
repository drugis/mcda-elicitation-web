'use strict';
module.exports = function(db) {
  var crypto = require('crypto');

  function findOrCreateUser(accessToken, refreshToken, googleUser, callback) {
    db.runInTransaction(userTransaction, function(error, result) {
      if (error) {
        return callback(error);
      }
      callback(null, result);
    });

    function userTransaction(client, callback) {
      client.query(
        'SELECT id, username, firstName, lastName FROM Account WHERE account.username = $1 OR account.email = $2',
        [googleUser.id, googleUser.emails[0].value],
        function(error, result) {
          if (error) {
            return callback(error);
          }
          var defaultPicture = process.env.MCDA_HOST + '/public/images/defaultUser.png';
          if (result.rows.length === 0) {
            client.query(
              'INSERT INTO Account (username, firstName, lastName) VALUES ($1, $2, $3) RETURNING id',
              [googleUser.id, googleUser.name.givenName, googleUser.name.familyName],
              function(error, result) {
                if (error) {
                  return callback(error);
                }
                var row = result.rows[0];
                return callback(null, {
                  id: row.id,
                  username: googleUser.id,
                  firstname: googleUser.name.givenName,
                  lastname: googleUser.name.familyName,
                  userPicture: googleUser.photos[0] ? googleUser.photos[0].value : defaultPicture
                });
              });
          } else {
            var user = result.rows[0];
            user.userPicture = googleUser.photos[0] ? googleUser.photos[0].value : defaultPicture;
            callback(null, user);
          }
        }
      );
    }
  }

  function findUserById(id, callback) {
    findUserByProperty('id', id, callback);
  }

  function findUserByEmail(email, callback) {
    findUserByProperty('email', email, callback);
  }

  function findUserByUsername(username, callback) {
    db.query('SELECT id, username, firstName, lastName, password, salt FROM Account WHERE username = $1',
      [username], function(error, result) {
        if (error) {
          callback(error);
        } else if (result.rows.length === 0) {
          callback('username ' + username + ' not found');
        } else {
          callback(null, result.rows[0]);
        }
      });
  }

  function sha512(password, salt) {//https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return value;
  }

  function createAccount(username, firstName, lastName, password, password2, callback) {
    if (password !== password2) { return; }
    var salt = generateSaltString(16);
    db.query('INSERT INTO account (username, firstName, lastName, password) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, firstName, lastName, password, salt], function(error, result) {
        if (error) { return callback(error); }
        var row = result.rows[0];
        return callback(null, {
          id: row.id,
          username: username,
          firstname: firstName,
          lastname: lastName
        });
      });
  }

  function generateSaltString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  function findUserByProperty(property, value, callback) {
    db.query('SELECT id, username, firstName, lastName, email FROM Account WHERE ' + property + ' = $1',
      [value], function(error, result) {
        if (error) {
          callback(error);
        } else if (result.rows.length === 0) {
          callback(property + ' ' + value + ' not found');
        } else {
          callback(null, result.rows[0]);
        }
      });
  }

  return {
    findOrCreateUser: findOrCreateUser,
    findUserById: findUserById,
    findUserByEmail: findUserByEmail,
    findUserByUsername: findUserByUsername,
    sha512: sha512
  };
};
