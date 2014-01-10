FROM stackbrew/ubuntu:13.10

RUN apt-get update

# install openjdk-7, getting around the fuse requirement with fakeroot
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q fakeroot 
RUN DEBIAN_FRONTEND=noninteractive fakeroot apt-get install -y -q openjdk-7-jdk

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q curl
RUN curl "http://mirrors.sendthisfile.com/apache/maven/maven-3/3.1.1/binaries/apache-maven-3.1.1-bin.tar.gz" | tar xzf -
RUN ln -s /apache-maven-3.1.1/bin/mvn /usr/local/bin/mvn

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q ruby2.0
RUN gem install --no-rdoc --no-ri compass

ADD spring /mcdaweb

RUN cd /mcdaweb/sass && compass compile
RUN mv /mcdaweb/sass/css /mcdaweb/src/main/webapp/resources/app/css

ADD mcdaweb.sh /usr/local/bin/mcdaweb
RUN chmod +x /usr/local/bin/mcdaweb

ENV MCDAWEB_DB_DRIVER org.h2.Driver
ENV MCDAWEB_DB_PASSWORD sa
ENV MCDAWEB_DB_URL jdbc:h2:/mcdaweb/database
ENV MCDAWEB_OAUTH_GOOGLE_SECRET w0rp7-_Z_JQk_T0YcvMe3Aky
ENV MCDAWEB_OAUTH_GOOGLE_KEY 501575320185-sjffuboubldeaio8ngl1hrgfdj5a2nia.apps.googleusercontent.com
ENV MCDAWEB_DB_USERNAME sa

RUN cd /mcdaweb && mvn compile

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/mcdaweb"]
