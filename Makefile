all: R/service.R SCSSC

R/service.R: R/measurements.R R/smaa.R R/macbethSolve.R
	cat $^ > $@

SCSSC:
	compass compile

.PHONY:
	SCSSC
