all: js/app.js js/test.js

js/app.js: js/misc.js js/services.js js/elicit/*.js
	cat $^ > $@

js/test.js: js/test/*.js
	cat $^ > $@
