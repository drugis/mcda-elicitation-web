# Deterministic MCDA test

library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
source('../measurements.R')
source('../SMAA.R')

# Load test problem
params <- fromJSON('../../examples/getreal-pwPVF.json')
#params <- fromJSON('../../examples/getreal-ordinalWeights.json')

# Conduct deterministic MCDA
run_deterministic(params)

# Perform multi-way sensitivity analysis on the measurements of OS for alt1 and alt2
run_sensitivityMeasurements(params)

# Obtain coordinates for the measurementsPlot
run_sensitivityMeasurementsPlot(params)

# Obtain coordinates for the weightPlot
run_sensitivityWeightPlot(params)

# Obtain coordinates for indifference curve
run_indifferenceCurve(params)

