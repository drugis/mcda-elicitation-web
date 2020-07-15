sampler.dsurv <- function(perf, N) {
  # Sample from the posterior distribution of the rate parameter lambda of the exponential survival function
  samples <- sampler.dgamma(perf, N)

  # Transform samples based on the selected summary measure
  return(survival.transform(perf, samples))
}

sampler.relative_survival <- function(perf, N) {
  baseline <- perf$parameters$baseline
  relative <- perf$parameters$relative

  baseline$parameters <- baseline[sapply(baseline, is.numeric)]
  baseline$parameters$summaryMeasure <- "hazard"

  base <- sampler(baseline, N)

  sampleDeriv <- function(base) {
    if (relative$type == 'dmnorm') {
      covarianceData <- relative$cov
      covariance <- matrix(unlist(covarianceData$data),
                           nrow = length(covarianceData$rownames),
                           ncol = length(covarianceData$colnames))
      return(exp(mvrnorm(N, relative$mu[covarianceData$rownames], covariance) + log(base)))
    }
  }
  samples <- sampleDeriv(base)

  # Transform samples based on the selected summary measure
  baseline$parameters$summaryMeasure <- baseline$summaryMeasure
  return(survival.transform(baseline, samples))
}

survival.mean <- function(x) {
  return(1 / x)
}

survival.median <- function(x) {
  return(qexp(0.5, x))
}

survival.at.time <- function(t, x) {
  # survival at time t expressed in %
  return(pexp(t, x, lower.tail = F))
}

survival.transform <- function(performance, samples) {
  if (performance$parameters$summaryMeasure == 'mean') {
    samples <- survival.mean(samples)
  }
  if (performance$parameters$summaryMeasure == 'median') {
    samples <- survival.median(samples)
  }
  if (performance$parameters$summaryMeasure == 'survivalAtTime') {
    samples <- survival.at.time(performance$parameters[['time']], samples)
  }
  return(samples)
}
