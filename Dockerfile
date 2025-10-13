# Use a modern Node so modern syntax works
FROM node:20-bullseye

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    DEBIAN_FRONTEND=noninteractive

# Optional: update base and install git (if build needs it)
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

# Yarn: Node 20 includes corepack; enable it so `yarn` works
RUN corepack enable

# Create app user + dir
RUN useradd --create-home --home /var/lib/mcda mcda
WORKDIR /var/lib/mcda

# Copy sources and set ownership
COPY . /var/lib/mcda
RUN chown -R mcda:mcda /var/lib/mcda

USER mcda
ENV HOME=/var/lib/mcda

# Install deps and build
RUN yarn
RUN yarn build-backend

# Build frontend (the original Dockerfile used build args; keep them)
ARG AUTH
ARG WEBPACK_COMMAND
ARG MATOMO_VERSION
ARG MCDA_HOST
ENV MCDA_HOST=${MCDA_HOST}

# Set webpack command based on AUTH mode
RUN if [ "$AUTH" = "LOCAL" ]; then export WEBPACK_COMMAND="build-local-login"; fi; \
    if [ -z "$MATOMO_VERSION" ]; then export MATOMO_VERSION='None'; fi; \
    if [ -n "$WEBPACK_COMMAND" ]; then npm run "$WEBPACK_COMMAND"; else npm run build-prod; fi

# The original EXPOSE was 3002
ENV HOST=0.0.0.0 \
    PORT=3002
EXPOSE 3002

# You can keep "forever" if you want; Node 20 will handle its deps fine.
# Simpler (and fewer moving parts) is to just run Node directly:
CMD ["node", "tscomp/index.js"]
# If you prefer forever, uncomment these two lines instead:
# RUN npm install -g forever
# CMD ["forever", "tscomp/index.js"]
