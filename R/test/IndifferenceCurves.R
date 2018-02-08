# Deterministic MCDA test

library(RJSONIO)
library(MASS)
library(smaa)
library(hitandrun)
library(ggplot2)

source('../measurements.R')
source('../SMAA.R')

# Load test problem
#params <- fromJSON('../../examples/getreal-pwPVF.json')
params <- fromJSON('../../examples/getreal-ordinalWeights.json')

params$IndifferenceCurves <- list(crit.x="OS",crit.y="severe")

test <- generateIndifferenceCurves(params)

n <- length(test)
data.plot <- c()
for (i in 1:length(test)) {
  data.plot <-rbind(data.plot,cbind(test[[i]]$x,test[[i]]$y,rep(test[[i]]$level,length(test[[i]]$x))))
}
data.plot <- as.data.frame(data.plot)
names(data.plot) <- c("x","y","value")

p <- ggplot(data.plot, aes(x=x,y=y,group=value))
p <- p + geom_line(aes(col=value))
p <- p + xlab("2-year survival") + ylab("Severe toxicity")



