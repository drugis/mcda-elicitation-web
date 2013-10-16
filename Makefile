all: js/app.js js/test.js R/service.R

js/patavi.js:
	wget -O - https://raw.github.com/joelkuiper/patavi/master/client/js/patavi.js > js/patavi.js

js/app.js: js/misc.js js/patavi.js js/services.js js/elicit/*.js
	cat $^ > $@

js/test.js: js/test/*.js
	cat $^ > $@

R/service.R: R/measurements.R R/smaa.R R/macbethSolve.R
	cat $^ > $@
