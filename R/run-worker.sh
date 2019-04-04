docker rm -f addis/patavi-mcda-worker || true
docker build --tag addis/patavi-mcda-worker .
docker run -d --link my-rabbit:rabbit -e PATAVI_BROKER_HOST=rabbit --name patavi-mcda-worker addis/patavi-mcda-worker
