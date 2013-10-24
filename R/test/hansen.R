library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
source('../measurements.R')

params <- fromJSON('../../examples/hansen.json')
meas <- sample.partialValues(params, 1E4)
weights <- simplex.sample(n=length(params$criteria), N=1E4)$samples

values <- smaa.values(meas, weights)
ranks <- smaa.ranks(values)
smaa.entropy.ranking(ranks)
