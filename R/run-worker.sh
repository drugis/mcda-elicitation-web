docker run -d --link my-rabbit:rabbit -e PATAVI_BROKER_HOST=rabbit --name patavi-worker-smaa-v2 patavi/smaa_v2
