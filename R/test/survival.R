# Survival data sampler test

library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
source('../measurements.R')

params <- fromJSON('../../examples/survival-test.json')

meas <- sample.partialValues(params, 1E4)

data <- params$performanceTable[[1]]$performance
sampler.dsurv(data,10)

data$parameters$summaryMeasure <- "mean"
sampler.dsurv(data,10)

data$parameters$summaryMeasure <- "median"
sampler.dsurv(data,10)

#plot(0:40,pexp(0:40,l,lower.tail=F),type="l",ylim=c(0,1))