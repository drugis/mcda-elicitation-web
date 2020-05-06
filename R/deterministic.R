# import getDeterministicResults from getDeterministicResults.R

run_deterministic <- function(params) {
  measurements <- genMedianMeasurements(params)
  return(getDeterministicResults(params, measurements))
}
