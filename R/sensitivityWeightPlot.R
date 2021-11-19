# import wrapMatrix from util.R
# import genRepresentativeWeights from weights.R

run_sensitivityWeightPlot <- function(params) {
  criterion <- params$sensitivityAnalysis["criterion"]
  totalValue <- getTotalValueForSensitivityWeightPlot(criterion, params)

  results <- list(
      "crit" = criterion,
      "total" = totalValue)
  return(results)
}

getTotalValueForSensitivityWeightPlot <- function(criterion, params) {
  
  measurements <- genMedianMeasurements(params)
  weights <- genRepresentativeWeights(params)

  if (params$sensitivityAnalysis$parameter == "weight") {
    xRange <- seq(0, 1, length.out = 101)
    criterionIndex <- which(names(weights) == criterion)
    totalValue <- c()
    for (value in xRange) {
      valueProfiles <- getValueProfilesForSensitivityWeightPlot(criterionIndex, params, measurements, weights, value)
      totalValue <- cbind(totalValue, rowSums(valueProfiles))
    }
  }
  
  if (params$sensitivityAnalysis$parameter == "importance") {
    xRange <- seq(1, 100, length.out = 100)
    criterionIndex <- which(names(weights) == criterion)
    importances <- weights/max(weights)*100
    totalValue <- c()
    for (value in xRange) {
      importances[criterionIndex] <- value
      currentWeights <- importances/sum(importances)
      valueProfiles <- calculateValueProfiles(params, measurements, currentWeights)
      totalValue <- cbind(totalValue, rowSums(valueProfiles))
    }
  }

  if (params$sensitivityAnalysis$parameter == "equivalentChange") {
    xRange <- seq(params$sensitivityAnalysis$lowestValue,
                  params$sensitivityAnalysis$highestValue, length.out = 100)
    criterionIndex <- which(names(weights) == criterion)
    totalValue <- c()
    newEquivalentChanges <- params$sensitivityAnalysis$equivalentChanges
    oldEquivalentChanges <- params$sensitivityAnalysis$equivalentChanges
    for (value in xRange) {
      importances <- weights/max(weights)*100
      newEquivalentChanges[criterionIndex] <- value
      newImportances <- importances * oldEquivalentChanges / newEquivalentChanges
      currentWeights <- newImportances/sum(newImportances)
      valueProfiles <- calculateValueProfiles(params, measurements, currentWeights)
      totalValue <- cbind(totalValue, rowSums(valueProfiles))
    }
  }

  colnames(totalValue) <- xRange
  return(wrapMatrix(totalValue))
}

getValueProfilesForSensitivityWeightPlot <- function(criterionIndex, params, measurements, weights, value) {
  adjust <- (1 - value) / sum(weights[-criterionIndex])
  currentWeights <- adjust * weights
  currentWeights[criterionIndex] <- value
  valueProfiles <- calculateValueProfiles(params, measurements, currentWeights)
  return(valueProfiles)
}
