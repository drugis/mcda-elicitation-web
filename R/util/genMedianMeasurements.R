# import generateSummaryStatistics from summaryStatistics.R

genMedianMeasurements <- function(params) {
  return(t(generateSummaryStatistics(params)[,, "50%"]))
}
