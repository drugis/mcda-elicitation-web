# import logit from util.R

icloglog <- function(x) {
  return(1 - exp(-exp(x)))
}

ilogit <- function(x) {
  return(1 / (1 + exp(-x)))
}

sampler.relative_logit_normal <- function(performance, N) {
  return(ilogit(sampler.relative_normal(performance, N)))
}

sampler.relative_log_normal <- function(performance, N) {
  return(exp(sampler.relative_normal(performance, N)))
}

sampler.relative_cloglog_normal <- function(performance, N) {
  return(icloglog(sampler.relative_normal(performance, N)))
}

sampler.relative_normal <- function(performance, N) {
  baseline <- performance$parameters$baseline
  relative <- performance$parameters$relative

  baseline$parameters <- unlist(baseline[sapply(baseline, is.numeric)])
  base <- sampler(baseline, N)

  if (relative$type == 'dmnorm') {
    covarianceData <- relative$cov
    covariance <- matrix(
      unlist(covarianceData$data),
      nrow = length(covarianceData$rownames),
      ncol = length(covarianceData$colnames)
    )
    return(mvrnorm(N, relative$mu[covarianceData$rownames], covariance) + base)
  } 
}
