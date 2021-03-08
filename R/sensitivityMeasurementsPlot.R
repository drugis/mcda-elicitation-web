# import wrapMatrix from util.R
# import genRepresentativeWeights from weights.R

run_sensitivityMeasurementsPlot <- function(params) {
  alternative <- params$sensitivityAnalysis["alternative"]
  criterion <- params$sensitivityAnalysis["criterion"]
  totalValue <- getTotalValueForSensitivityMeasurementsPlot(params, alternative, criterion)

  results <- list(
      "alt" = alternative,
      "crit" = criterion,
      "total" = totalValue)
  return(results)
}

getTotalValueForSensitivityMeasurementsPlot <- function(params, alternative, criterion) {
  xCoordinates <- getXCoordinates(params$criteria[[criterion]]$pvf)
  measurements <- genMedianMeasurements(params)
  weights <- genRepresentativeWeights(params)

  totalValue <- c()
  for (value in xCoordinates) {
    measurements[alternative, criterion] <- value
    totalValue <- cbind(totalValue, rowSums(calculateValueProfiles(params, measurements, weights)))
  }
  colnames(totalValue) <- xCoordinates
  return(wrapMatrix(totalValue))
}

getXCoordinates <- function(pvf) {
  if (pvf$type == 'linear') {
    return(seq(pvf$range[1], pvf$range[2], length.out = 101))
  } else {
    return(c(pvf$range[1], pvf$cutoffs, pvf$range[2]))
  }
}
