docker run -d --link rabbit-composed:rabbit -e PATAVI_BROKER_HOST=rabbit \
  --network patavi-composed-network \
  --name patavi-mcda-worker addis/patavi-smaa-worker
