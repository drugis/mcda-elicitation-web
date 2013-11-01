all: R/service.R

R/service.R: R/measurements.R R/smaa.R R/macbethSolve.R
	cat $^ > $@
