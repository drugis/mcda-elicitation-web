FROM phusion/baseimage

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt update
RUN apt upgrade -y -f -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" 

# Install nodejs
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
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
ARG WEBPACK_COMMAND
RUN if [ "$WEBPACK_COMMAND" != ""  ] ; then npm run $WEBPACK_COMMAND ; else npm run build-prod ; fi

EXPOSE 3002

CMD ["forever", "index.js"]
