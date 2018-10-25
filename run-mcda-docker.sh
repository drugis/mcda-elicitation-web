ATHENTICATION_METHOD="$1"
docker run -d \
 --link postgres \
 --link patavi-server:localdocker \
 -p 3002:3002 \
 --name mcda \
 -e MCDAWEB_DB_HOST=postgres \
 -e MCDAWEB_GOOGLE_KEY=221368301791-7ark4468l8p2tt9sc5dvr9bb36si181h.apps.googleusercontent.com \
 -e MCDAWEB_GOOGLE_SECRET=Ju9grxy6LU72NlyHUUZ1xjDd \
 -e MCDAWEB_COOKIE_SECRET=GDFBDF#$%*asdfg098 \
 -e MCDAWEB_DB_NAME=mcda \
 -e MCDAWEB_DB_PASSWORD=develop \
 -e MCDAWEB_DB_USER=mcda \
 -e MCDAWEB_AUTHENTICATION_METHOD=$ATHENTICATION_METHOD \
 -e MCDA_HOST=http://localhost:3002 \
 -e PATAVI_CLIENT_CRT=ssl/crt.pem \
 -e PATAVI_CLIENT_KEY=ssl/key.pem \
 -e PATAVI_CA=ssl/ca-crt.pem \
 -e PATAVI_HOST=localdocker \
 -e PATAVI_PORT=3000 \
  addis/mcda
