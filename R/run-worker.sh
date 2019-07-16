docker rm -f addis/patavi-smaa-worker || true
docker build --tag addis/patavi-smaa-worker .
docker run -d --link my-rabbit:rabbit -e PATAVI_BROKER_HOST=rabbit --name patavi-mcda-worker addis/patavi-smaa-worker
