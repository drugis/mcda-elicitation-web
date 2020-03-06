run_scales <- function(params) {
  applyOverRows <- 1
  return(apply(generateSummaryStatistics(params), applyOverRows, wrapMatrix))
}
