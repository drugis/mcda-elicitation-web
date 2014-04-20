
Running
-------

Define the following environment variables (with examples):

	export MCDAWEB_DB_CHANGELOG=database.h2.sql
	export MCDAWEB_DB_DRIVER=org.h2.Driver
	export MCDAWEB_DB_URL=jdbc:h2:../database
	export MCDAWEB_DB_USERNAME=sa
	export MCDAWEB_DB_PASSWORD=sa
	export MCDAWEB_OAUTH_GOOGLE_SECRET=w0rp7-_Z_JQk_T0YcvMe3Aky
	export MCDAWEB_OAUTH_GOOGLE_KEY=501575320185-sjffuboubldeaio8ngl1hrgfdj5a2nia.apps.googleusercontent.com

Then do:

	mvn tomcat:run

Make sure you've run `make` in the repository root first to generate the CSS.

Running with PostgreSQL
-----------------------

Set up the database:

	sudo -u postgres psql -c "CREATE USER mcdaweb WITH PASSWORD 'develop'"
	sudo -u postgres psql -c "CREATE DATABASE mcdaweb ENCODING 'utf-8' OWNER mcdaweb"

Set up the environment:

	export MCDAWEB_DB_CHANGELOG=database.pg.sql
	export MCDAWEB_DB_DRIVER=org.postgresql.Driver
	export MCDAWEB_DB_URL=jdbc:postgresql://localhost/mcdaweb
	export MCDAWEB_DB_USERNAME=mcdaweb
	export MCDAWEB_DB_PASSWORD=develop
	export MCDAWEB_OAUTH_GOOGLE_SECRET=w0rp7-_Z_JQk_T0YcvMe3Aky
    export MCDAWEB_OAUTH_GOOGLE_KEY=501575320185-sjffuboubldeaio8ngl1hrgfdj5a2nia.apps.googleusercontent.com

To run the integration tests
-----------------------

Install [protractor](https://github.com/angular/protractor) with.

    npm install -g protractor

Start up a selenium server (See https://github.com/angular/protractor for help with this).
By default, the tests expect the selenium server to be running at http://localhost:4444/wd/hub.

To enable the integration test user to login you need to add a user to the account table in the database.
The password should be encrypted using [bcrypt](http://en.wikipedia.org/wiki/Bcrypt).
For the PostgreSQL database the [pgcrypto module](http://www.postgresql.org/docs/9.3/static/pgcrypto.html) is needed to encrypt the password.

    sudo apt-get install postgresql-contrib
    sudo -u postgres psql -d mcdaweb -c "CREATE EXTENSION pgcrypto"

    sudo -u postgres psql -d mcdaweb -c "INSERT INTO account (username, firstname, lastname, password) VALUES ([username], 'firstname', 'lastname', crypt([password], gen_salt('bf', 10)))"

Run integration tests by either setting username and password using params as show or user the protractor-conf.js file.
(See https://github.com/angular/protractor for more information on configuring protractor).

    protractor --seleniumAddress=http://127.0.0.1:4444/wd/hub  --params.login.user=[username] --params.login.password=[password] protractor-conf.js