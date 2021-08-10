rancher kubectl create -f k8s/namespace.yaml #namespace creation works only through GUI for now

rancher kubectl delete secret mcda-secrets -n mcda
rancher kubectl create secret generic mcda-secrets \
  -n mcda \
  --from-literal=MCDAWEB_COOKIE_SECRET=GDFBDF#$%*asdfg098 \
  --from-literal=MCDAWEB_GOOGLE_SECRET=Ju9grxy6LU72NlyHUUZ1xjDd \
  --from-literal=MCDAWEB_GOOGLE_KEY=221368301791-7ark4468l8p2tt9sc5dvr9bb36si181h.apps.googleusercontent.com

rancher kubectl delete secret db-credentials -n mcda
rancher kubectl create secret generic db-credentials \
  -n mcda \
  --from-literal=POSTGRES_PASSWORD=develop \
  --from-literal=PATAVI_DB_PASSWORD=develop \
  --from-literal=MCDAWEB_DB_PASSWORD=develop

rancher kubectl delete configmap mcda-settings -n mcda
rancher kubectl create configmap mcda-settings \
  -n mcda \
  --from-literal=MCDAWEB_AUTHENTICATION_METHOD=GOOGLE \
  --from-literal=MCDAWEB_DB_USER=mcda \
  --from-literal=MCDA_HOST=mcda:3002 \
  --from-literal=MCDAWEB_DB_HOST=postgres \
  --from-literal=MCDAWEB_DB_NAME=mcda \
  --from-literal=PATAVI_HOST=patavi.edge.molgenis.org \
  --from-literal=PATAVI_PORT=3000 \
  --from-literal=SECURE_TRAFFIC=true

rancher kubectl delete secret passwords -n mcda
rancher kubectl create secret generic passwords \
 -n mcda \
 --from-literal=rabbit-password=develop \
 --from-literal=PATAVI_AUTHORISED_TOKEN=badasstoken

rancher kubectl delete configmap patavi-settings -n mcda
rancher kubectl create configmap patavi-settings \
  -n mcda \
  --from-literal=PATAVI_DB_HOST=postgres \
  --from-literal=PATAVI_DB_NAME=patavi \
  --from-literal=PATAVI_DB_USER=patavi \
  --from-literal=PATAVI_PORT=3000 \
  --from-literal=PATAVI_HOST=patavi.edge.molgenis.org \
  --from-literal=PATAVI_BROKER_HOST=guest:develop@rabbitmq \
  --from-literal=PATAVI_BROKER_USER=guest \
  --from-literal=PATAVI_BROKER_PASSWORD=develop \
  --from-literal=SECURE_TRAFFIC=true

rancher kubectl apply -f postgres.yaml #not 100%, does not include pv and pv claim, those were done manually
rancher kubectl apply -f rabbitmq.yaml
rancher kubectl apply -f patavi-server.yaml
rancher kubectl apply -f patavi-db-init.yaml
rancher kubectl apply -f patavi-smaa-worker.yaml
rancher kubectl apply -f mcda-db-init.yaml
rancher kubectl apply -f mcda.yaml
