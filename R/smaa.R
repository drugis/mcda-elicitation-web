# import wrapMatrix from util.R
# import sampleWeights from weights.R
# import hitAndRunSamples from constants.R
# import createPvf from pvf.R

run_smaa <- function(params) {
  smaaResults <- getSmaaResults(params)
  return(formatSmaaResults(smaaResults, names(params$alternatives)))
}

getSmaaResults <- function(params) {
  criteriaNames <- names(params$criteria)
  weights <- getSmaaWeights(params, criteriaNames)
  measurements <- getSmaaMeasurements(params, criteriaNames, hitAndRunSamples)
  ranks <- getRanks(measurements, weights)
  rankAcceptability <- smaa.ra(ranks)
  confidenceFactors <- getConfidenceFactors(ranks, weights, measurements)
  weightsQuantiles <- getWeightsQuantiles(weights)
  results <- list(rankAcceptability = rankAcceptability, confidenceFactors = confidenceFactors, weightsQuantiles = weightsQuantiles)
  return(results)
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

isOldScenario <- function(params) {
  return(!is.null(params$uncertaintyOptions))
}

getSmaaMeasurements <- function(params, criteria, numberOfSamples) {
  measurements <- sample.partialValues(params, numberOfSamples)
  if (isOldScenario(params)) {
    if (!params$uncertaintyOptions["measurements"]) {
      measurements <- applyMeasurementUncertainty(params, criteria, measurements)
    }
  }
  return(measurements)
}

applyMeasurementUncertainty <- function(params, criteria, measurements) {
  medianMeasurements <- genMedianMeasurements(params)
  pvf <- lapply(params$criteria, createPvf)
  for (criterion in criteria) {
    medianMeasurements[, criterion] <- pvf[[criterion]](medianMeasurements[, criterion])
  }
  for (i in 1:hitAndRunSamples) {
    measurements[i,,] <- medianMeasurements
  }
  return(measurements)
}

getRanks <- function(measurements, weights) {
  utils <- smaa.values(measurements, weights)
  ranks <- smaa.ranks(utils)
  return(ranks)
}

getConfidenceFactors <- function(ranks, weights, measurements) {
  centralWeights <- smaa.cw(ranks, weights)
  cf <- smaa.cf(measurements, centralWeights)
  return(cf)
}

getWeightsQuantiles <- function(weights) {
  weightsQuantiles <- apply(weights, 2, quantile, probs = c(0.025, 0.5, 0.975))
  weightsQuantiles[2,] <- colMeans(weights)
  rownames(weightsQuantiles)[2] <- "mean";
  return(weightsQuantiles)
}

formatSmaaResults <- function(smaaResults, alternativeNames) {
  centralWeights <- lapply(alternativeNames, function(alt) {
    list(cf = unname(smaaResults$confidenceFactors$cf[alt]), w = smaaResults$confidenceFactors$cw[alt,])
  })
  names(centralWeights) <- alternativeNames

  results <- list(
      "cw" = centralWeights,
      "ranks" = wrapMatrix(smaaResults$rankAcceptability),
      "weightsQuantiles" = wrapMatrix(smaaResults$weightsQuantiles))
  return(results)
}
