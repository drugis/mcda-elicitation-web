all: js/app.js js/test.js

js/clinicico.js:
	wget -O - https://raw.github.com/joelkuiper/clinicico/develop/client/js/clinicico.js > js/clinicico.js

js/app.js: js/misc.js js/clinicico.js js/services.js js/elicit/*.js
	cat $^ > $@

js/test.js: js/test/*.js
	cat $^ > $@
