# Dockerfile for the SMAA Patavi worker

FROM addis/patavi-worker-base

USER root

RUN DEBIAN_FRONTEND=noninteractive apt install -y -q r-cran-mass
RUN DEBIAN_FRONTEND=noninteractive apt install -y -q libgmp-dev

RUN R -e 'install.packages("hitandrun", repos="http://cran.rstudio.com/"); if (!require("hitandrun")) quit(save="no", status=8)'
RUN R -e 'install.packages("smaa", repos="http://cran.rstudio.com/"); if (!require("smaa")) quit(save="no", status=8)'
RUN R -e 'install.packages("abind", repos="http://cran.rstudio.com/"); if (!require("abind")) quit(save="no", status=8)'

ADD *.R /tmp/
ADD util/*.R /tmp/
RUN rm  /tmp/apiEntryPoint.R

RUN cat /tmp/*.R > /var/lib/patavi/smaa_service.R

USER patavi
WORKDIR /var/lib/patavi

ENTRYPOINT ["patavi-worker", "--method", "smaa_v2", "-n", "1", "--file", "/var/lib/patavi/smaa_service.R", "--rserve", "--packages", "MASS,rcdd,hitandrun,smaa,abind"]
