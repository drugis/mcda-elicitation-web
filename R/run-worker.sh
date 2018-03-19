docker rm -f patavi-worker-smaa-v2
docker build --tag patavi-worker-smaa-v2 .
docker run -d --link my-rabbit:rabbit -e PATAVI_BROKER_HOST=rabbit --name patavi-worker-smaa-v2 patavi-worker-smaa-v2
