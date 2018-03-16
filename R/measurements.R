# Required packages: MASS

logit <- function(x) {
  log(x/(1-x))
}

ilogit <- function(x) {
  1 / (1 + exp(-x))
}

icloglog <- function(x) {
  1 - exp(-exp(x))
}

cloglog <- function(x) {
  log(-log(1-x))
}

survival.mean <- function(x) {
  1/x
}

survival.median <- function(x) {
  qexp(0.5,x)
}

survival.at.time <- function(t,x) { # survival at time t expressed in %
  pexp(t,x,lower.tail=F)
}

survival.transform <- function(perf, samples) {

  if (perf$parameters$summaryMeasure=='mean') {
    samples <- survival.mean(samples)
  }

  if (perf$parameters$summaryMeasure=='median') {
    samples <- survival.median(samples)
  }

  if (perf$parameters$summaryMeasure=='survivalAtTime') {
    samples <- survival.at.time(perf$parameters[['time']],samples)
  }

  samples
}

assign.sample <- function(defn, samples) {
  N <- dim(samples)[1]
  if (!is.null(defn$alternative)) { # performance table based on relative effect estimates + baseline effect distribution
    samples[, defn$alternative, defn$criterion] <- sampler(defn$performance, N)
  } else {
    x <- sampler(defn$performance, N) # performance table based on absolute effect estimates
    samples[, colnames(x), defn$criterion] <- x
  }
  samples
}

sampler <- function(perf, N) {
  fn <- paste('sampler', gsub('-', '_', perf[['type']]), sep='.')
  do.call(fn, list(perf, N))
}

sampler.dgamma <- function(perf, N) {
  rgamma(N, perf$parameters[['alpha']], perf$parameters[['beta']])
}

sampler.dsurv <- function(perf, N) {

  # Sample from the posterior distribution of the rate parameter lambda of the exponential survival function
  samples <- sampler.dgamma(perf, N)

  # Transform samples based on the selected summary measure
  survival.transform(perf, samples)

}

sampler.dbeta <- function(perf, N) {
  rbeta(N, perf$parameters['alpha'], perf$parameters['beta'])
}

sampler.dbeta_cloglog <- function(perf, N) {
  cloglog(rbeta(N, perf$parameters['alpha'], perf$parameters['beta']))
}

sampler.dbeta_logit <- function(perf, N) {
  logit(rbeta(N, perf$parameters['alpha'], perf$parameters['beta']))
}

sampler.dnorm <- function(perf, N) {
  rnorm(N, perf$parameters['mu'], perf$parameters['sigma'])
}

sampler.exact <- function(perf, N) {
  
  output <- rep(perf$value, length.out=N)
  
  if (!is.null(perf$isNormal)) {
    if(perf$isNormal) {
      if(!is.null(perf$stdErr)) {
        sigma <- perf$stdErr
      } else {
        sigma <- (perf$upperBound - perf$lowerBound)/(2*1.96)
      }
      output <- rnorm(N, perf$value, sigma)
    } 
  }
  
  output
  
}

sampler.dt <- function(perf, N) {
  perf$parameters['mu'] + perf$parameters['stdErr'] * rt(N, perf$parameters['dof'])
}

sampler.relative_survival <- function(perf, N) {
  baseline <- perf$parameters$baseline
  relative <- perf$parameters$relative

  baseline$parameters <- baseline[sapply(baseline, is.numeric)]
  baseline$parameters$summaryMeasure <- "hazard"
  
  base <- sampler(baseline, N)

  sampleDeriv <- function(base) {
    if(relative$type == 'dmnorm') {
      varcov <- relative$cov
      covariance <- matrix(unlist(varcov$data),
                           nrow=length(varcov$rownames),
                           ncol=length(varcov$colnames))
      exp(mvrnorm(N, relative$mu[varcov$rownames], covariance) + log(base))
    }
  }
  samples <- sampleDeriv(base)

  # Transform samples based on the selected summary measure
  baseline$parameters$summaryMeasure <- baseline$summaryMeasure
  survival.transform(baseline, samples)

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
