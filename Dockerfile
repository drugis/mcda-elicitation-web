FROM phusion/baseimage:18.04-1.0.0

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt update
RUN apt upgrade -y -f -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" 

# Install nodejs
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs git

RUN npm install -g yarn
RUN npm install -g forever

RUN useradd --create-home --home /var/lib/mcda mcda

COPY . /var/lib/mcda
RUN chown -R mcda.mcda /var/lib/mcda

USER mcda
WORKDIR /var/lib/mcda
ENV HOME /var/lib/mcda

RUN yarn
RUN yarn build-backend
ARG WEBPACK_COMMAND
ARG MATOMO_VERSION
ARG MCDA_HOST
RUN export MCDA_HOST=$MCDA_HOST
RUN if [ "$MATOMO_VERSION" != "" ] ; then export MATOMO_VERSION=$MATOMO_VERSION ; else export MATOMO_VERSION='Test' ; fi
RUN if [ "$WEBPACK_COMMAND" != ""  ] ; then npm run $WEBPACK_COMMAND ; else npm run build-prod ; fi

EXPOSE 3002

CMD ["node", "tscomp/index.js"]
