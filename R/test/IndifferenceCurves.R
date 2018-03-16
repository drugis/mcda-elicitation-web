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

crit.y <- "OS"
crit.x <- "severe"

params$IndifferenceCurves <- list(crit.x=crit.x,crit.y=crit.y)

data.lines <- run_indifferenceCurves(params)
effects.table <- genMedianMeasurements(params) 
data.points <- data.frame(x=effects.table[,crit.x],y=effects.table[,crit.y],alternative=sapply(row.names(effects.table),function(x) params$alternatives[[x]]))

p <- ggplot(data.lines, aes(x=x,y=y,group=value))
p <- p + geom_line(size=1)
p <- p + xlab(params$criteria[[crit.x]]$title) + ylab(params$criteria[[crit.y]]$title)
#p <- p + scale_colour_gradientn(colours = rainbow(5))
p <- p + geom_point(mapping=aes(x=x,y=y,col=alternative),data=data.points,size=3,inherit.aes=F)
#p <- p + xlim(45,65)
p
