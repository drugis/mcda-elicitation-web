mcda-elicitation-web
====================

This tool provides a web interface for Multiple Criteria Decision
Analysis preference elicitation. Currently, it supports eliciting the
following types of preference information:

- Linear partial value functions
- Piece-wise linear partial value functions using MACBETH
- Ranking criteria trade-offs (ordinal SWING)
- Exact criteria trade-off ratios (exact SWING)
- Imprecise criteria trade-off ratios (interval SWING)

The tool uses the [Patavi][patavi] web service wrapper for R and the
'hitandrun' and 'smaa' R packages to calculate MCDA results during and
after the preference elicitation process.

mcda-elicitation-web is a component of the [drugis.org][drugis] ADDIS 2
project. For more information on all components of the drugis project, please refer to the OVERALL-README.md in the root folder of the ADDIS-CORE project.

Prerequisites for running mcda-web
-----------------------------------

- A PostgreSQL instance with an initialised database. You can create one in a docker container by running the `setup-db.sh` script. Make sure to change the passwords from the default.

If you already have a postgresql database you can use, it can be initialised as follows (change passwords as desired):

    CREATE USER mcda WITH PASSWORD 'develop';
    CREATE DATABASE mcda ENCODING 'utf-8' OWNER mcda;

Create a .pgpass in the user home to store the database password
the file should contain a line with the following format hostname:port:database:username:password, e.g:

    localhost:5432:mcda:mcda:develop

Create the schema (shell script)

    psql -h localhost -U mcda -d mcda -f database.pg.sql

- A patavi-server instance along with a rabbitMQ service. see the [patavi repository](https://github.com/drugis/patavi) for installation and running instructions.

- At least one smaa patavi worker, started by executing the `run-worker.sh` script.

Running as Docker container
===========================

Building the image (optional)
-----------------------------

You can build a new local image by executing the `build-docker.sh` script. This would be required for example if you wish to change the default SSL keys. Note that this script assumes that your keys are present in an `ssl` subdirectory of the main mcda directory. Also note that, if your patavi server presents a certificate that is not trusted by default, there should be a CA certificate for the signing certificate authority of your patavi container in this directory. The default patavi server image presents a certificate signed by the Drugis [self-signed certificate authority](https://drugis.org/files/ca-crt.pem)

The `build-docker.sh` script also lets you specify the signin method via command line arugment. The current options are Google OAuth 2.0 (`GOOGLE`) and username/password (`LOCAL`). The default signin method is Google OAuth 2.0.

You can add users for the `LOCAL` signin method by using the `add-user.sh` script. Note: this script relies on external utilities which must be installed by running `yarn` first, one time.

Running the container
---------------------

Execute the `run-gemtc-docker.sh` script.

If you built the container with a specific login method arugment, you should run the `run-mcda-docker.sh` script with the same one.

e.g.:
```
./build-docker.sh LOCAL
./run-gemtc-docker.sh LOCAL
```

**Note** that you should probably change the default settings in the script (e.g. check whether the link arguments match the names of your containers, and the names of the certificate files match those in your `ssl` directory if you built your own image). The script also assumes that the sql database and patavi server and worker are already set up and running. The run script runs the `addis/gemtc` image, which will be pulled from docker hub by default. The default image comes with SSL keys which assume `localhost` or `localdocker` CNs, and which are signed by our [self-signed certificate authority](https://drugis.org/files/ca-crt.pem).

Because the default patavi-server image users a certificate signed by our [certificate authority](https://drugis.org/files/ca-crt.pem) you need to add this certificate to the browser's trusted authorities for R results to be displayed.

Running as standalone application
=================================

Setting up the database
-----------------------

`sudo -u postgres psql -c "CREATE USER mcdaweb WITH PASSWORD 'develop'"`
`sudo -u postgres psql -c "CREATE DATABASE mcdaweb ENCODING 'utf-8' OWNER mcdaweb"`
`psql -d mcdaweb -U mcdaweb -f database.pg.sql`

Running
-------

Set environment variables:

```
export MCDAWEB_DB_USER=mcdaweb
export MCDAWEB_DB_PASSWORD=develop
export MCDAWEB_DB_HOST=localhost
export MCDAWEB_DB_NAME=mcdaweb
export MCDAWEB_GOOGLE_KEY=<something>
export MCDAWEB_GOOGLE_SECRET=<something-else>
export MCDA_HOST=localhost
export PATAVI_HOST=localhost
export PATAVI_PORT=3000
export PATAVI_CLIENT_KEY=path/to/key
export PATAVI_CLIENT_CRT=/path/to/crt
export PATAVI_CA=/path/to/ca
```

Getting the dependencies:

    yarn

Building the application:

    npm run build-prod

Running the application:

`node index.js` or `npm start`

Running the patavi worker
-------------------------

As a prerequisite, build the patavi worker image from the patavi repository.

Then, build the worker itself, in the `R` directory:

    docker build --tag patavi/worker-smaa_v2 .

Run the worker:

    docker run -d --link <rabbitmq-container-name>:rabbit --name patavi-smaa_v2 patavi/worker-smaa_v2

Development
===========

Tests
-----

Executing tests:

    npm test

Building the frontend with inline source maps for faster debugging:

    npm run build-dev

Continually rebuilding while you develop:

    npm run dev


Initialize submodules (only needed for CSS rebuilding)
------------------------------------------------------

```
git submodule init
git submodule update
```

Compiling the CSS
-----------------

Using compass (through `config.rb`):

```
compass compile
```

Using node-sass:

```
node-sass --include-path sass-shared sass/mcda-plain.scss app/css/mcda-plain.css
node-sass --include-path sass-shared sass/mcda-drugis.scss app/css/mcda-drugis.css
```


License
-------

mcda-elicitation-web is open source, and licensed under [GPLv3][gpl-3].
See [LICENSE.txt](LICENSE.txt) for more information.

[patavi]: https://github.com/joelkuiper/patavi
[gpl-3]: http://gplv3.fsf.org/
[drugis]: http://drugis.org/
