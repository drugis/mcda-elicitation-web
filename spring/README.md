
Running
-------

Define the following environment variables (with examples):

	MCDAWEB_DB_DRIVER=org.h2.Driver
	MCDAWEB_DB_PASSWORD=sa
	MCDAWEB_DB_URL=jdbc:h2:../database
	MCDAWEB_OAUTH_GOOGLE_SECRET=w0rp7-_Z_JQk_T0YcvMe3Aky
	MCDAWEB_OAUTH_GOOGLE_KEY=501575320185-sjffuboubldeaio8ngl1hrgfdj5a2nia.apps.googleusercontent.com
	MCDAWEB_DB_USERNAME=sa


Then do:

	export MAVEN_OPTS="${JAVA_OPTS} -DMCDAWEB_DB_DRIVER=$MCDAWEB_DB_DRIVER -DMCDAWEB_DB_URL=$MCDAWEB_DB_URL -DMCDAWEB_DB_USERNAME=$MCDAWEB_DB_USERNAME -DMCDAWEB_DB_PASSWORD=$MCDAWEB_DB_PASSWORD"
	mvn tomcat:run

Make sure you've run `make` in the repository root first.
