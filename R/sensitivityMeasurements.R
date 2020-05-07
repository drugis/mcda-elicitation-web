run_sensitivityMeasurements <- function(params) {
  measurements <- genMedianMeasurements(params)
  for (entry in params$sensitivityAnalysis$meas) {
    measurements[entry$alternative, entry$criterion] <- entry$value
  }
  results <- getDeterministicResults(params, measurements)
  results$weights <- NULL
  return(results)
}
