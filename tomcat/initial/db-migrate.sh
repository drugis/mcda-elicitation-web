#!/bin/bash

. /var/lib/tomcat7/mcda-web-secrets

/usr/share/liquibase/liquibase \
	--classpath=/usr/share/tomcat7/lib/h2-1.3.174.jar \
	--url=$MCDAWEB_DB_URL \
	--username=$MCDAWEB_DB_USERNAME \
	--password=$MCDAWEB_DB_PASSWORD \
	--changeLogFile=/var/lib/tomcat7/mcda-web.sql \
	update
