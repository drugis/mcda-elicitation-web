FROM mcdaweb

RUN rm -Rf /var/lib/tomcat7/webapps/ROOT
ADD secrets.sh /var/lib/tomcat7/mcda-web-secrets
ADD server.xml /etc/tomcat7/
ADD mcda-web.war /var/lib/tomcat7/webapps/ROOT.war
ADD database.sql /var/lib/tomcat7/mcda-web.sql

RUN /usr/local/bin/mcda-web-update

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/tomcat7-run"]
