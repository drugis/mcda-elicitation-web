FROM mcdaweb

ADD secrets.sh /var/lib/tomcat7/mcda-web-secrets
ADD mcda-web.war /var/lib/tomcat7/webapps/mcda-web.war
ADD database.sql /var/lib/tomcat7/mcda-web.sql

RUN /usr/local/bin/mcda-web-update

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/tomcat7-run"]
