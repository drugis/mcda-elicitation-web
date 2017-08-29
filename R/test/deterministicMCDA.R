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

# Perform one-way sensitivity analysis on the weight given to OS
oneWaySensitivityWeights(params,"OS",0.3)

# Perform one-way sensitivity analysis on the measurement of OS for alt1
oneWaySensitivityMeasurements(params,"alt1","OS",58)