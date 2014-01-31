
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
