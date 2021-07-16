rancher kubectl create -f k8s/namespace.yaml #namespace creation works only through GUI for now

rancher kubectl create secret generic mcda-secrets \
  -n mcda \
  --from-literal=MCDAWEB_COOKIE_SECRET=GDFBDF#$%*asdfg098 
  
rancher kubectl create configmap certificates \
  -n mcda \
  --from-file=secrets/ssl/client-crt.pem \
  --from-file=secrets/ssl/client-key.pem \
  --from-file=secrets/ssl/ca-crt.pem \
  --from-file=secrets/ssl/patavi-server-crt.pem \
  --from-file=secrets/ssl/patavi-server-key.pem

rancher kubectl create secret generic db-credentials \
  -n mcda \
  --from-literal=POSTGRES_PASSWORD=develop \
  --from-literal=PATAVI_DB_PASSWORD=develop \
  --from-literal=MCDAWEB_DB_PASSWORD=develop

rancher kubectl create configmap mcda-settings \
  -n mcda \
  --from-literal=MCDAWEB_AUTHENTICATION_METHOD=GOOGLE \
  --from-literal=MCDAWEB_DB_USER=mcda \
  --from-literal=MCDA_HOST=mcda:3002 \
  --from-literal=MCDAWEB_DB_HOST=postgres \
  --from-literal=MCDAWEB_DB_NAME=mcda \
  --from-literal=PATAVI_HOST=patavi-server-composed \
  --from-literal=PATAVI_PORT=3000 \
  --from-literal=PATAVI_CLIENT_KEY=ssl/client-key.pem \
  --from-literal=PATAVI_CLIENT_CRT=ssl/client-crt.pem \
  --from-literal=PATAVI_CA=ssl/ca-crt.pem

rancher kubectl create secret generic passwords \
 -n mcda \
 --from-literal=rabbit-password=develop

rancher kubectl create configmap patavi-settings \
  -n mcda \
  --from-literal=PATAVI_DB_HOST=postgres \
  --from-literal=PATAVI_DB_NAME=patavi \
  --from-literal=PATAVI_DB_USER=patavi \
  --from-literal=PATAVI_PORT=3000 \
  --from-literal=PATAVI_BROKER_HOST=guest:develop@rabbitmq \
  --from-literal=PATAVI_BROKER_USER=guest \
  --from-literal=PATAVI_BROKER_PASSWORD=develop \
  --from-literal=PATAVI_SELF=//192.168.99.101:3000

rancher kubectl apply -f postgres.yaml #not 100%, does not include pv and pv claim, those were done manually
rancher kubectl apply -f rabbitmq.yaml
rancher kubectl apply -f patavi-server.yaml
rancher kubectl apply -f patavi-db-init.yaml
rancher kubectl apply -f patavi-smaa-worker.yaml
rancher kubectl apply -f mcda-db-init.yaml
rancher kubectl apply -f mcda.yaml

#ingress not work

#ingress/routing
#mandatory
# rancher kubectl apply -f ingress-nginx.yaml -n ingress-nginx-mcda
#service
#change this if deploying on specific cloud (AWS, GKE, Azure have different versions, see https://kubernetes.github.io/ingress-nginx/deploy/)
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud-generic.yaml
# kubectl apply -f k8s/ingress.yaml
