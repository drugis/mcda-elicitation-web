FROM stackbrew/ubuntu:13.10

RUN apt-get update

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q tomcat7
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q curl

RUN echo '#!/bin/bash\n. /var/lib/tomcat7/mcda-web-secrets\nCATALINA_BASE=/var/lib/tomcat7 /usr/share/tomcat7/bin/catalina.sh run' >/usr/local/bin/tomcat7-run
RUN chmod +x /usr/local/bin/tomcat7-run

RUN curl "http://repo2.maven.org/maven2/com/h2database/h2/1.3.174/h2-1.3.174.jar" -o /usr/share/tomcat7/lib/h2-1.3.174.jar

RUN mkdir /usr/share/liquibase
RUN curl --location "http://sourceforge.net/projects/liquibase/files/Liquibase%20Core/liquibase-3.1.0-bin.tar.gz/download" | tar xzf - -C /usr/share/liquibase
RUN chmod +x /usr/share/liquibase/liquibase

ADD db-migrate.sh /usr/local/bin/mcda-web-update
RUN chmod +x /usr/local/bin/mcda-web-update
