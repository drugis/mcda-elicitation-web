# make sure all files have trailing new lines at the end of the file
library(MASS)
library(hitandrun)

smaa_v2 <- function(params) {
  allowed <- c(
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

  if(params$method %in% allowed) {
    if (!is.null(params$seed)) {
      set.seed(params$seed)
    } else {
      set.seed(1234)
    }
    do.call(paste("run", params$method, sep="_"), list(params))
  } else {
    stop(paste("method ", params$method, " not allowed"))
  }
}
