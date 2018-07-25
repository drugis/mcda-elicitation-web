# Deterministic MCDA test

library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
source('../measurements.R')
source('../smaa.R')

# Load test problem
params <- fromJSON('../../examples/fava.json')
params <- fromJSON('../../examples/hansen.json')

params <- fromJSON('getreal-ordinalWeights.json')
params <- fromJSON('getreal-pwPVF.json')
params <- fromJSON('absoluteRelative.json')
params <- fromJSON('problemWithEmpty.json')

# Test scale function
run_scales(params)

# Conduct deterministic MCDA
run_deterministic(params)

# Perform multi-way sensitivity analysis on the measurements of OS for alt1 and alt2
# run_sensitivityMeasurements(params)

# Obtain coordinates for the measurementsPlot
run_sensitivityMeasurementsPlot(params)

# Obtain coordinates for the weightPlot
run_sensitivityWeightPlot(params)

# Obtain coordinates for indifference curve
run_indifferenceCurve(params)
