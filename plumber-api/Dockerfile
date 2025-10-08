# Dockerfile for MCDA Plumber API
# This replaces the complex Patavi architecture with a simple REST API

FROM rocker/r-ver:4.3.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    libgmp-dev \
    libsodium-dev \
    zlib1g-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install required R packages - use RJSONIO to match old Patavi worker behavior
RUN R -e "install.packages(c('plumber', 'RJSONIO'), repos='https://cloud.r-project.org/'); if (!require('plumber')) quit(save='no', status=8)"
RUN R -e "install.packages('MASS', repos='https://cloud.r-project.org/'); if (!require('MASS')) quit(save='no', status=8)"
RUN R -e "install.packages('hitandrun', repos='https://cloud.r-project.org/'); if (!require('hitandrun')) quit(save='no', status=8)"
RUN R -e "install.packages('smaa', repos='https://cloud.r-project.org/'); if (!require('smaa')) quit(save='no', status=8)"
RUN R -e "install.packages('rcdd', repos='https://cloud.r-project.org/'); if (!require('rcdd')) quit(save='no', status=8)"
RUN R -e "install.packages('abind', repos='https://cloud.r-project.org/'); if (!require('abind')) quit(save='no', status=8)"

# Create app directory
WORKDIR /app

# Create directories
RUN mkdir -p /app/R/util

# Copy R scripts
COPY R/*.R /app/R/
COPY R/util/*.R /app/R/util/

# Copy Plumber API definition
COPY plumber-api/plumber.R /app/

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run Plumber API
CMD ["R", "-e", "pr <- plumber::plumb('/app/plumber.R'); pr$run(host='0.0.0.0', port=8000, swagger=TRUE)"]
