docker run -d --link my-rabbit:rabbit -e PATAVI_BROKER_HOST=rabbit \
  --name patavi-mcda-worker addis/patavi-smaa-worker
