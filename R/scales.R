# import wrapMatrix from util.R
# import generateSummaryStatistics from summaryStatistics.R

run_scales <- function(params) {
  applyOverRows <- 1
  return(apply(generateSummaryStatistics(params), applyOverRows, wrapMatrix))
}
