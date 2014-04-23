# The analysis used to fail if there was a single preference statement

library(RJSONIO)
library(smaa)
library(hitandrun)

update <- function(i) {}

source('../measurements.R')
source('../smaa.R')

params <- fromJSON('../../examples/chouinnard.json')

actual <- run_smaa(params)
print(actual$ranks)
