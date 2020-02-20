# Required packages: hitandrun
library(hitandrun)

hitAndRunSamples <- 1E4

applyWrapResult <- function(results) {
  mapply(wrap.result,
         results,
         SIMPLIFY = F)
}

wrap.result <- function(result) {
  list(data = result)
}

wrap.matrix <- function(matrix) {
  resultingList <- lapply(rownames(matrix), function(name) { matrix[name,] })
  names(resultingList) <- rownames(matrix)
  return(resultingList)
}

run_scales <- function(params) {
  apply(generateSummaryStatistics(params), 1, wrap.matrix)
}

getRatioConstraint <- function(times, index1, index2, value) {
  array <- rep(0, times)
  array[index1] <- -1
  array[index2] <- value
  constraints <- list(
    "constr" = t(array),
    "rhs" = c(0),
    "dir" = c("="))
  return(constraints)
}

run_deterministic <- function(params) {
  measurements <- genMedianMeasurements(params)
  getDeterministicResults(params, measurements)
}

getDeterministicResults <- function(params, measurements) {
  weights <- genRepresentativeWeights(params)
  valueProfiles <- calculateValueProfiles(params, measurements, weights)
  totalValue <- rowSums(valueProfiles)

  results <- list(
      "weights" = weights,
      "value" = wrap.matrix(valueProfiles),
      "total" = totalValue)
  applyWrapResult(results)
}

run_representativeWeights <- function(params) {
  weights <- list("data" = genRepresentativeWeights(params))
  return(weights)
}

genRepresentativeWeights <- function(params) {
  criteria <- names(params$criteria)
  weights <- sampleWeights(params$preferences, criteria)
  representativeWeights <- colMeans(weights)
  names(representativeWeights) <- criteria
  return(representativeWeights)
}

genMedianMeasurements <- function(params) {
  t(generateSummaryStatistics(params)[,, "50%"])
}

genHARconstraint <- function(statement, criteria) {
  numberOfCriteria <- length(criteria)
  index1 <- which(criteria == statement$criteria[1])
  index2 <- which(criteria == statement$criteria[2])

  if (statement$type == "ordinal") {
    return(ordinalConstraint(numberOfCriteria, index1, index2))
  } else if (statement$type == "ratio bound") {
    return(getRatioBoundConstraint(statement$bounds, numberOfCriteria, index1, index2))
  } else if (statement$type == "exact swing") {
    return(getRatioConstraint(numberOfCriteria, index1, index2, statement$ratio))
  }
}

getRatioBoundConstraint <- function(bounds, numberOfCriteria, index1, index2) {
  lowerBound <- bounds[1]
  upperBound <- bounds[2]
  return(mergeConstraints(
    lowerRatioConstraint(numberOfCriteria, index1, index2, lowerBound),
    upperRatioConstraint(numberOfCriteria, index1, index2, upperBound)
  ))
}

calculateValueProfiles <- function(params, measurements, weights) {
  pvf <- lapply(params$criteria, create.pvf)
  for (criterion in names(params$criteria)) {
    measurements[, criterion] <- pvf[[criterion]](measurements[, criterion]) * weights[criterion]
  }
  return(measurements)
}

run_sensitivityMeasurements <- function(params) {
  measurements <- genMedianMeasurements(params)
  for (entry in params$sensitivityAnalysis$meas) {
    measurements[entry$alternative, entry$criterion] <- entry$value
  }
  results <- getDeterministicResults(params, measurements)
  results$weights <- NULL
  return(results)
}

run_sensitivityMeasurementsPlot <- function(params) {
  alternative <- params$sensitivityAnalysis["alternative"]
  criterion <- params$sensitivityAnalysis["criterion"]
  totalValue <- getTotalValueForSensitivityMeasurementsPlot(params, alternative, criterion)

  results <- list(
      "alt" = alternative,
      "crit" = criterion,
      "total" = totalValue)
  return(applyWrapResult(results))
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
  return(wrap.matrix(totalValue))
}

getXCoordinates <- function(pvf) {
  if (pvf$type == 'linear') {
    xCoordinates <- pvf$range
  } else {
    xCoordinates <- c(pvf$range[1], pvf$cutoffs, pvf$range[2])
  }
  return(xCoordinates)
}

run_sensitivityWeightPlot <- function(params) {
  criterion <- params$sensitivityAnalysis["criterion"]
  totalValue <- getTotalValueForSensitivityWeightPlot(criterion, params)

  results <- list(
      "crit" = criterion,
      "total" = totalValue)
  applyWrapResult(results)
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
  return(wrap.matrix(totalValue))
}

getValueProfilesForSensitivityWeightPlot <- function(criterionIndex, params, measurements, weights, value) {
  adjust <- (1 - value) / sum(weights[-criterionIndex])
  currentWeights <- adjust * weights
  currentWeights[criterionIndex] <- value
  valueProfiles <- calculateValueProfiles(params, measurements, currentWeights)
  return(valueProfiles)
}

getCutoffs <- function(params, criteria) {
  cutoffs <- list(
    "x" = getCutoffsForCriterion(params$criteria[[criteria$x]]$pvf),
    "y" = getCutoffsForCriterion(params$criteria[[criteria$y]]$pvf)
  )
  return(cutoffs)
}

getCutoffsForCriterion <- function(pvf) {
  cutoffs <- pvf$range
  if (pvf$type != "linear") {
    cutoffs <- c(cutoffs, pvf$cutoffs)
  }
  return(cutoffs)
}

run_matchingElicitationCurve <- function(params) {
  criteria <- getSelectedCriteria(params$indifferenceCurve)
  weight <- getMatchingWeight(params, criteria$y)

  params$preferences <- list(list(
    type = 'exact swing',
    ratio = weight,
    criteria = c(criteria$x, criteria$y))
  )

  result <- run_indifferenceCurve(params)
  result$weight <- weight
  return(result)
}

getMatchingWeight <- function(params, criterionY) {
  pvf <- create.pvf(params$criteria[[criterionY]])
  chosenY <- params$indifferenceCurve$chosenY
  if (!is.null(params$criteria[[criterionY]]$isFavorable) && !params$criteria[[criterionY]]$isFavorable) {
    return(1 - pvf(chosenY))
  } else {
    return(pvf(chosenY))
  }
}

run_indifferenceCurve <- function(params) {
  criteria <- getSelectedCriteria(params$indifferenceCurve)
  getDifferenceWithReference <- getDifferenceWithReferenceFunction(params, criteria)
  cutOffs <- getCutoffs(params, criteria)
  ranges <- getRanges(params$criteria, criteria)
  coordinatesForCutoffs <- getCoordinatesForCutoffs(cutOffs, getDifferenceWithReference, ranges)
  coordinates <- getCoordinates(cutOffs, coordinatesForCutoffs, ranges)
  return(wrap.result(coordinates))
}

getDifferenceWithReferenceFunction <- function(params, criteria) {
  weights <- genRepresentativeWeights(params)
  pvf <- lapply(params$criteria, create.pvf)
  referencePoint <- c(params$indifferenceCurve$x, params$indifferenceCurve$y)
  indifferenceValue <- getIndifferenceValue(weights, criteria, pvf, referencePoint)
  getDifferenceWithReference <- function(x, y) {
    as.numeric(weights[criteria$x] * pvf[[criteria$x]](x) + weights[criteria$y] * pvf[[criteria$y]](y) - indifferenceValue)
  }
  return(getDifferenceWithReference)
}

getCoordinatesForCutoffs <- function(cutOffs, getDifferenceWithReference, ranges) {
  coordinatesForCutoffs <- list(
    "xForY" = getXCoordinateForYCutOff(cutOffs$y, getDifferenceWithReference, ranges$y),
    "yForX" = getYCoordinateForXCutoff(cutOffs$x, getDifferenceWithReference, ranges$y)
  )
  return(coordinatesForCutoffs)
}

getSelectedCriteria <- function(selectedCriteria) {
  criteria <- list(
    "x" = selectedCriteria$criterionX,
    "y" = selectedCriteria$criterionY
  )
  return(criteria)
}

getRanges <- function(criteria, selectedCriteria) {
  ranges <- list(
    "x" = criteria[[selectedCriteria$x]]$pvf$range,
    "y" = criteria[[selectedCriteria$y]]$pvf$range
  )
  return(ranges)
}

getIndifferenceValue <- function(weights, criteria, pvf, referencePoint) {
  xWeight <- weights[criteria$x] * pvf[[criteria$x]](referencePoint[1])
  yWeight <- weights[criteria$y] * pvf[[criteria$y]](referencePoint[2])
  indifferenceValue <- as.numeric(xWeight + yWeight)
  return(indifferenceValue)
}

getCoordinates <- function(cutOffs, coordinatesForCutoffs, ranges) {
  coordinates <- data.frame(x = c(cutOffs$x, coordinatesForCutoffs$xForY), y = c(coordinatesForCutoffs$yForX, cutOffs$y))
  coordinates <- coordinates[order(coordinates$x),]
  coordinates <- removeCoordinatesOutsideOfRange(coordinates, coordinates$x, ranges$x)
  coordinates <- removeCoordinatesOutsideOfRange(coordinates, coordinates$y, ranges$y)
  rownames(coordinates) <- NULL
  return(coordinates)
}

removeCoordinatesOutsideOfRange <- function(coordinates, values, range) {
  epsilon <- 0.001 * (range[2] - range[1]);
  coordinates <- coordinates[values + epsilon >= range[1] & values - epsilon <= range[2],]
  return(coordinates)
}

getYCoordinateForXCutoff <- function(xCutOffs, getValueDifference, yRange) {
  yCoordinateForXCutoff <- c()
  for (x in xCutOffs) {
    yCoordinateForXCutoff <- c(yCoordinateForXCutoff, uniroot(f = getValueDifference, interval = yRange, x = x, extendInt = "yes")$root)
  }
  return(yCoordinateForXCutoff)
}

getXCoordinateForYCutOff <- function(yCutOffs, getValueDifference, yRange) {
  xCoordinateForYCutoff <- c()
  for (y in yCutOffs) {
    xCoordinateForYCutoff <- c(xCoordinateForYCutoff, uniroot(f = getValueDifference, interval = yRange, y = y, extendInt = "yes")$root)
  }
  return(xCoordinateForYCutoff)
}

sampleWeights <- function(preferences, criteria) {
  numberOfCriteria <- length(criteria)
  constr <- mergeConstraints(lapply(preferences, genHARconstraint, crit = criteria))
  constr <- mergeConstraints(simplexConstraints(numberOfCriteria), constr)
  weights <- hitandrun(constr, n.samples = hitAndRunSamples)
  colnames(weights) <- criteria
  return(weights)
}

getSmaaWeights <- function(params, criteria) {
  weights <- sampleWeights(params$preferences, criteria)
  if (isOldScenario(params)) {
    if (!params$uncertaintyOptions["weights"]) {
      meanWeights <- colMeans(weights)
      for (i in 1:hitAndRunSamples) {
        weights[i,] <- meanWeights
      }
    }
  }
  return(weights)
}

getSmaaMeasurements <- function(params, criteria) {
  measurements <- sample.partialValues(params, hitAndRunSamples)
  if (isOldScenario(params)) {
    if (!params$uncertaintyOptions["measurements"]) {
      measurements <- applyMeasurementUncertainty(params, criteria, measurements)
    }
  }
  return(measurements)
}

isOldScenario <- function(params) {
  return(!is.null(params$uncertaintyOptions))
}

applyMeasurementUncertainty <- function(params, criteria, measurements) {
  medianMeasurements <- genMedianMeasurements(params)
  pvf <- lapply(params$criteria, create.pvf)
  for (criterion in criteria) {
    medianMeasurements[, criterion] <- pvf[[criterion]](medianMeasurements[, criterion])
  }
  for (i in 1:hitAndRunSamples) {
    measurements[i,,] <- medianMeasurements
  }
  return(measurements)
}

run_smaa <- function(params) {
  smaaResults <- getSmaaResults(params)
  formatSmaaResults(smaaResults, names(params$alternatives))
}

getSmaaResults <- function(params) {
  criteriaNames <- names(params$criteria)
  weights <- getSmaaWeights(params, criteriaNames)
  measurements <- getSmaaMeasurements(params, criteriaNames)
  ranks <- getRanks(measurements, weights)
  rankAcceptability <- smaa.ra(ranks)
  cf <- getCF(ranks, weights, measurements)
  weightsQuantiles <- getWeightsQuantiles(weights)
  results <- list(rankAcceptability = rankAcceptability, cf = cf, weightsQuantiles = weightsQuantiles)
  return(results)
}

getWeightsQuantiles <- function(weights) {
  weightsQuantiles <- apply(weights, 2, quantile, probs = c(0.025, 0.5, 0.975))
  weightsQuantiles[2,] <- colMeans(weights)
  return(weightsQuantiles)
}

getRanks <- function(measurements, weights) {
  utils <- smaa.values(measurements, weights)
  ranks <- smaa.ranks(utils)
  return(ranks)
}

getCF <- function(ranks, weights, measurements) {
  centralWeights <- smaa.cw(ranks, weights)
  cf <- smaa.cf(measurements, centralWeights)
  return(cf)
}

formatSmaaResults <- function(smaaResults, alternativeNames) {
  centralWeights <- lapply(alternativeNames, function(alt) {
    list(cf = unname(smaaResults$cf$cf[alt]), w = smaaResults$cf$cw[alt,])
  })
  names(centralWeights) <- alternativeNames

  results <- list(
      "cw" = centralWeights,
      "ranks" = wrap.matrix(smaaResults$rankAcceptability),
      "weightsQuantiles" = wrap.matrix(smaaResults$weightsQuantiles))
  return(applyWrapResult(results))
}
