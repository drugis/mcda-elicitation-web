docker run --name postgres -e POSTGRES_PASSWORD=develop -d postgres
docker run -i -v `pwd`:`pwd` -w `pwd` --rm --link postgres:postgres postgres psql -h postgres -U postgres \
  -c "CREATE USER mcda WITH PASSWORD 'develop'" -c "CREATE DATABASE mcda ENCODING 'utf-8' OWNER mcda" \
  -c '\c mcda mcda' -f database.pg.sql
