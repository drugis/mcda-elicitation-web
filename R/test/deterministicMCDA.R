# Deterministic MCDA test

library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
source('../measurements.R')
source('../SMAA.R')

# Load test problem
params <- fromJSON('../../examples/getreal-ordinalWeights.json')

# Conduct deterministic MCDA
run_deterministic(params)

# Perform multi-way sensitivity analysis on the measurements of OS for alt1 and alt2
run_sensitivityMeasurements(params)

# Perform one-way sensitivity analysis on the weight given to OS
run_sensitivityWeights(params)