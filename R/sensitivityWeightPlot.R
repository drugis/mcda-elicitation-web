run_sensitivityWeightPlot <- function(params) {
  criterion <- params$sensitivityAnalysis["criterion"]
  totalValue <- getTotalValueForSensitivityWeightPlot(criterion, params)

  results <- list(
      "crit" = criterion,
      "total" = totalValue)
  return(results)
}

getTotalValueForSensitivityWeightPlot <- function(criterion, params) {
  weightRange <- seq(0, 1, length.out = 101)
  measurements <- genMedianMeasurements(params)
  weights <- genRepresentativeWeights(params)
  criterionIndex <- which(names(weights) == criterion)
  totalValue <- c()
  for (value in weightRange) {
    valueProfiles <- getValueProfilesForSensitivityWeightPlot(criterionIndex, params, measurements, weights, value)
    totalValue <- cbind(totalValue, rowSums(valueProfiles))
  }
  colnames(totalValue) <- weightRange
  return(wrapMatrix(totalValue))
}

getValueProfilesForSensitivityWeightPlot <- function(criterionIndex, params, measurements, weights, value) {
  adjust <- (1 - value) / sum(weights[-criterionIndex])
  currentWeights <- adjust * weights
  currentWeights[criterionIndex] <- value
  valueProfiles <- calculateValueProfiles(params, measurements, currentWeights)
  return(valueProfiles)
}
