'use strict';
module.exports = function(db) {

  function findOrCreateUser(sess, accessToken, extra, googleUser) {
    var user = this.Promise();

    function userTransaction(client, callback) {
      client.query("SELECT id, username, firstName, lastName FROM UserConnection LEFT JOIN Account ON UserConnection.userid = Account.username WHERE providerUserId = $1 AND providerId = 'google'", [googleUser.id], function(error, result) {
        if (error) {
          return callback(error);
        }
        if (result.rows.length === 0) {
          client.query("INSERT INTO UserConnection (userId, providerId, providerUserId, rank, displayName, profileUrl, accessToken, refreshToken, expireTime)" +
            " VALUES ($1, 'google', $2, 1, $3, $4, $5, $6, $7)", [googleUser.id, googleUser.id, googleUser.name, googleUser.link, accessToken, extra.refresh_token, extra.expires_in],
            function(error) {
              if (error) {
                return callback(error);
              }
              client.query("INSERT INTO Account (username, firstName, lastName) VALUES ($1, $2, $3) RETURNING id", [googleUser.id, googleUser.given_name, googleUser.family_name],
                function(error, result) {
                  if (error) {
                    return callback(error);

                  }
                  var row = result.rows[0];
                  return callback(null, {
                    'id': row.id,
                    'username': googleUser.id,
                    'firstName': googleUser.given_name,
                    'lastName': googleUser.family_name
                  });
                });
            });
        } else {
          callback(null, result.rows[0]);
        }
      });
    }

    db.runInTransaction(userTransaction, function(error, result) {
      if (error) {
        return user.fail(error);
      }
      user.fulfill(result);
    });

    return user;
  }

  function findUserById(id, callback) {
    findUserByProperty('id', id, callback);
  }

  function findUserByEmail(email, callback) {
    findUserByProperty('email', email, callback);
  }

  // private
  function findUserByProperty(property, value, callback) {
    db.query('SELECT id, username, firstName, lastName, email FROM Account WHERE ' + property + ' = $1', [value], function(error, result) {
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
    findUserByEmail: findUserByEmail
  };
};