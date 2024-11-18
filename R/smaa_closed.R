smaa_v2 <- function(params) {
  allowed <- c(
    'aggregatedSmaa',
    'choiceBasedMatching',
    'deterministic',
    'indifferenceCurve',
    'matchingElicitationCurve',
    'representativeWeights',
    'scales',
    'sensitivityMeasurements',
    'sensitivityMeasurementsPlot',
    'sensitivityWeightPlot',
    'smaa'
  )

  if (params$method %in% allowed) {
    if (!is.null(params$seed)) {
      set.seed(params$seed)
    } else {
      set.seed(1234)
    }
    do.call(paste("run", params$method, sep = "_"), list(params))
  } else {
    stop(paste("method ", params$method, " not allowed"))
  }
}

getAggregatedSmaaResults <- function(params) {
  problems <- params$problems
  numberOfProblems <- length(problems)
  numberOfCriteria <- length(problems[[1]]$criteria)
  criterionIds <- names(problems[[1]]$criteria)
  progressStep <- 80 / numberOfProblems
  currentProgress <- 0
  update(currentProgress)

  problemForMeasurements <- problems[[1]]
  if (!is.null(params$uncertaintyOptions)) {
    problemForMeasurements$uncertaintyOptions <- params$uncertaintyOptions
  }
  currentProgress <- 10
  update(currentProgress)

  scenarioWeights <- vector("list", numberOfProblems)
  names(scenarioWeights) <- names(params$problems)
  aggregatedWeights <- c()
  for (i in 1:numberOfProblems) {
    currentWeights <- getSmaaWeights(problems[[i]], criterionIds)
    scenarioWeights[[i]] <- currentWeights
    aggregatedWeights <- rbind(aggregatedWeights, currentWeights)
    currentProgress <- currentProgress + progressStep
    update(floor(currentProgress))
  }
  measurements <- getSmaaMeasurements(problemForMeasurements, criterionIds, hitAndRunSamples * numberOfProblems)
  utils <- smaa.values(measurements, aggregatedWeights)
  ranks <- smaa.ranks(utils)

  ra <- smaa.ra(ranks)
  cw <- smaa.cw(ranks, aggregatedWeights)
  cf <- smaa.cf(measurements, cw)

  results.aggregated <- list(
    "rankAcceptability" = ra,
     "centralWeights" = cw,
     "confidenceFactors" = cf,
     "weightsQuantiles" = summaryWeights(aggregatedWeights))
  results.scenario <- vector("list", length(scenarioWeights))
  for (i in 1:length(scenarioWeights)) {
    results.scenario[[i]] <- summaryWeights(scenarioWeights[[i]])
  }
  names(results.scenario) <- names(params$problems)

  return(list(aggregated = results.aggregated, scenario = results.scenario))
}

summaryWeights <- function(weights) {
  weights.quantiles <- apply(weights, 2, quantile, probs = c(0.025, 0.5, 0.975))
  weights.quantiles[2,] <- colMeans(weights)
  rownames(weights.quantiles)[2] <- "mean";
  weights.quantiles
}

formatAggregatedSmaaResults <- function(smaa.results, alts.names) {
  formattedSmaaResults <- formatSmaaResults(smaa.results$aggregated, alts.names)
  for (i in 1:length(smaa.results$scenario)) {
    smaa.results$scenario[[i]] <- wrapMatrix(smaa.results$scenario[[i]])
  }

  formattedScenario <- list(results = smaa.results$scenario, descriptions = "Quantiles of the individual weights")
  formattedScenario <- mapply(wrapResult, formattedScenario$results, formattedScenario$descriptions, SIMPLIFY = F)
  results <- list(
    "cw" = formattedSmaaResults$cw,
    "ranks" = formattedSmaaResults$ranks,
    "weightsQuantiles" = formattedSmaaResults$weightsQuantiles,
    "scenarioWeightsQuantiles" = formattedScenario
  )
  return(results)
}

wrapResult <- function(result, description) {
  list(data = result, description = description, type = class(result))
}

run_aggregatedSmaa <- function(params) {
  smaa.results <- getAggregatedSmaaResults(params)
  formatAggregatedSmaaResults(smaa.results, names(params$problems[[1]]$alternatives))
}
