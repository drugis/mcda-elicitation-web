FROM phusion/baseimage

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y

# Install nodejs
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g yarn
RUN npm install -g forever

RUN useradd --create-home --home /var/lib/mcda mcda

COPY . /var/lib/mcda
RUN chown -R mcda.mcda /var/lib/mcda

USER mcda
WORKDIR /var/lib/mcda
ENV HOME /var/lib/mcda

RUN yarn
RUN npm run build-prod

RUN rm bower_components && ln -rs node_modules/@bower_components bower_components

EXPOSE 3001

CMD ["forever", "index.js"]
