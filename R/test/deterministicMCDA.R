# Deterministic MCDA test

library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
source('../measurements.R')
source('../SMAA.R')

# Load test problem
#params <- fromJSON('../../examples/getreal-pwPVF.json')
params <- fromJSON('../../examples/getreal-ordinalWeights.json')

# Conduct deterministic MCDA
run_deterministic(params)

# Perform multi-way sensitivity analysis on the measurements of OS for alt1 and alt2
run_sensitivityMeasurements(params)

# Obtain coordinates for the measurementsPlot
run_sensitivityMeasurementsPlot(params)

# Obtain coordinates for the weightPlot
run_sensitivityWeightPlot(params)

### Marginal weight bounds + weight space exploration ###  

params <- fromJSON('myeloma.json')

# Ranking
params$preferences <- list(list(type="ordinal",criteria=c("PFS","Sev tox")),
                           list(type="ordinal",criteria=c("Sev tox","Mod tox")))

# Imprecise swing weighting
params$preferences <- list(list(type="ratio bound",criteria=c("PFS","Mod tox"),bounds=c(100/40,100/20)),
                           list(type="ratio bound",criteria=c("PFS","Sev tox"),bounds=c(100/70,100/50)))

bounds <- run_weightBounds(params)
values <- genRepresentativeWeights(params)

params$deterministicWeights <- list(list(criterion="Sev tox",weight=0.36))
bounds <- run_weightBounds(params)
values <- genRepresentativeWeights(params)

library("ggplot2")
df <- data.frame(value=values,lower=bounds$lower,upper=bounds$upper,weight=c("PFS","Moderate","Severe"))
p <- ggplot(df, aes(y=value,ymin=lower,ymax=upper,x=weight))
p <- p + geom_pointrange()
p <- p + coord_flip()
