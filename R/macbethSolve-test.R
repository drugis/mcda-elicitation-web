## NOTE: parsing JSON matrix with null values to matrix with NAs
#library(RJSONIO)
#str <- "[[1, 2, null],[null, 3, 4],[5,null,6]]"
#x <- fromJSON(str)
#y <- t(sapply(x, rbind))
#y[sapply(y, is.null)] <- NA

### Example from "A career choice problem: ..."
# Comparing reference levels on the "monetary reward" criterion
# Fig. 2 & 4

## Strength of preference:
# 0 = no / indifferent
# 1 = very weak
# 2 = weak
# 3 = moderate
# 4 = strong
# 5 = very strong
# 6 = extreme

## Criterion reference levels are sorted from best to worst (ties allowed)

## Hesitation on strength of preference is handled by specifying min/max
## preference level:

min.p <- rbind(
  c( 0,  3,  4,  4,  3,  6,  6,  6), # I-banking
  c(NA,  0,  3,  3,  3,  6,  6,  6), # Consulting
  c(NA, NA,  0,  1,  1,  4,  5,  6), # Corp. Sales
  c(NA, NA, NA,  0,  0,  5,  5,  6), # good
  c(NA, NA, NA, NA,  0,  5,  4,  6), # I-broker
  c(NA, NA, NA, NA, NA,  0,  1,  4), # neutral
  c(NA, NA, NA, NA, NA, NA,  0,  3), # Teaching
  c(NA, NA, NA, NA, NA, NA, NA,  0)) # Service

max.p <- rbind(
  c( 0,  3,  4,  4,  4,  6,  6,  6), # I-banking
  c(NA,  0,  3,  3,  3,  6,  6,  6), # Consulting
  c(NA, NA,  0,  1,  2,  5,  5,  6), # Corp. Sales
  c(NA, NA, NA,  0,  0,  6,  5,  6), # good
  c(NA, NA, NA, NA,  0,  5,  5,  6), # I-broker
  c(NA, NA, NA, NA, NA,  0,  1,  4), # neutral
  c(NA, NA, NA, NA, NA, NA,  0,  4), # Teaching
  c(NA, NA, NA, NA, NA, NA, NA,  0)) # Service

sol <- macbethSolve(min.p, max.p)
print(sol / max(sol))

## Values given in paper:
cutoffs <- c(-62.5, -12.5, 0.0, 100.0, 100.0, 112.5, 150.0, 187.5)
print(all(abs((sol-sol[6])/(sol[4]-sol[6])*100-rev(cutoffs)) < 2))
