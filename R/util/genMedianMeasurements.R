genMedianMeasurements <- function(params) {
  return(t(generateSummaryStatistics(params)[,, "50%"]))
}
