all: js/app.js js/test.js R/service.R

js/clinicico.js:
	wget -O - https://raw.github.com/joelkuiper/clinicico/develop/client/js/clinicico.js > js/clinicico.js

js/app.js: js/misc.js js/clinicico.js js/services.js js/elicit/*.js
	cat $^ > $@

js/test.js: js/test/*.js
	cat $^ > $@

R/service.R: R/smaa.R R/macbethSolve.R
	cat $^ > $@
