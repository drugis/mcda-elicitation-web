# Required packages: MASS

ilogit <- function(x) {
  1 / (1 + exp(-x))
}

icloglog <- function(x) {
  1 - exp(-exp(x))
}

assign.sample <- function(defn, samples) {
  N <- dim(samples)[1]
  if (!is.null(defn$alternative)) {
    samples[, defn$alternative, defn$criterion] <- sampler(defn$performance, N)
  } else {
    x <- sampler(defn$performance, N)
    samples[, colnames(x), defn$criterion] <- x
  }
  samples
}

sampler <- function(perf, N) {
  fn <- paste('sampler', gsub('-', '_', perf[['type']]), sep='.')
  do.call(fn, list(perf, N))
}

sampler.dbeta <- function(perf, N) {
  rbeta(N, perf$parameters['alpha'], perf$parameters['beta'])
}

sampler.dbeta_logit <- function(perf, N) {
  ilogit(rbeta(N, perf$parameters['alpha'], perf$parameters['beta']))
}

sampler.dnorm <- function(perf, N) {
  rnorm(N, perf$parameters['mu'], perf$parameters['sigma'])
}

sampler.exact <- function(perf, N) {
  rep(perf$value, lenght.out=N)
}

sampler.dt <- function(perf, N) {
  print(perf)
  perf$parameters['mu'] + perf$parameters['stdErr'] * rt(N, perf$parameters['dof'])
}

sampler.relative_normal <- function(perf, N) {
  baseline <- perf$parameters$baseline
  relative <- perf$parameters$relative

  baseline$parameters <- unlist(baseline[sapply(baseline, is.numeric)])
  base <- sampler(baseline, N)

  sampleDeriv <- function(base) {
    if(relative$type == 'dmnorm') {
      varcov <- relative$cov
      covariance <- matrix(unlist(varcov$data),
                            nrow=length(varcov$rownames),
                            ncol=length(varcov$colnames))
      mvrnorm(N, relative$mu[varcov$rownames], covariance) + base
    }
  }
  sampleDeriv(base)
}

sampler.relative_logit_normal <- function(perf, N) {
  ilogit(sampler.relative_normal(perf, N))
}

sampler.relative_log_normal <- function(perf, N) {
  exp(sampler.relative_normal(perf, N))
}

sampler.relative_cloglog_normal <- function(perf, N) {
  icloglog(sampler.relative_normal(perf, N))
}

sample <- function(alts, crit, performanceTable, N) {
  meas <- array(dim=c(N,length(alts), length(crit)), dimnames=list(NULL, alts, crit))
  for (measurement in performanceTable) {
    meas <- assign.sample(measurement, meas)
  }
  meas
}

create.pvf <- function(criterion) {
  pvf <- criterion$pvf
  if (pvf$direction == 'increasing') {
    worst <- pvf$range[1]
    best <- pvf$range[2]
  } else if (pvf$direction == 'decreasing') {
    worst <- pvf$range[2]
    best <- pvf$range[1]
  } else {
    stop(paste("Invalid PVF direction '", pvf$direction, "'", sep=""))
  }

  if (pvf$type == 'piecewise-linear') {
    return(partialValue(best, worst, pvf$cutoffs, pvf$values))
  } else if (pvf$type == 'linear') {
    return(partialValue(best, worst))
  } else {
    stop(paste("Invalid PVF type '", pvf$type, "'", sep=""))
  }
}

partialValue <- function(best, worst, cutoffs=numeric(), values=numeric()) {
  if (best > worst) {
    # Increasing
    v <- c(0, values, 1)
    y <- c(worst, cutoffs, best)
  } else {
    # Decreasing
    v <- c(1, values, 0)
    y <- c(best, cutoffs, worst)
  }
  function(x) {
    smaa.pvf(x, y, v, outOfBounds="interpolate")
  }
}

sample.partialValues <- function(params, N) {
  pvf <- lapply(params$criteria, create.pvf);
  meas <- sample(names(params$alternatives), names(params$criteria), params$performanceTable, N)
  for (criterion in names(params$criteria)) {
    meas[,,criterion] <- pvf[[criterion]](meas[,,criterion])
  }
  meas
}
