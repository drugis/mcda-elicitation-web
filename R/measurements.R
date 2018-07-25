# Required packages: MASS
library(MASS)

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

survival.transform <- function(performance, samples) {
  if (performance$parameters$summaryMeasure=='mean') {
    samples <- survival.mean(samples)
  }
  if (performance$parameters$summaryMeasure=='median') {
    samples <- survival.median(samples)
  }
  if (performance$parameters$summaryMeasure=='survivalAtTime') {
    samples <- survival.at.time(performance$parameters[['time']],samples)
  }
  samples
}

assign.sample <- function(defn, samples) {
  N <- dim(samples)[1]
  if (!is.null(defn$alternative)) { # performance table based on absolute effect estimates
    samples[, defn$alternative, defn$criterion] <- sampler(defn$performance, N)
  } else {
    x <- sampler(defn$performance, N) # performance table based on relative effect estimates + baseline effect distribution
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

sampler.empty <-function(perf, N){
  rep(NA, N)
}

sampler.exact <- function(perf, N) {
  output <- rep(perf$value, length.out=N)
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

generateSummaryStatistics <- function(params) {
  crit <- names(params$criteria)
  alts <- names(params$alternatives)
  performanceTable <- params$performanceTable
  summaryStatistics <- array(dim=c(length(crit),length(alts), 4), dimnames=list(crit, alts, c("2.5%","50%","97.5%","mode")))
  for (distribution in performanceTable) {
    if (!is.null(distribution$alternative)) {
      summaryStatistics[distribution$criterion,distribution$alternative,] <- summaryStatistics.absolute(distribution)
    } else {
      EffectsTableRow <- summaryStatistics.relative.sample(distribution)
      summaryStatistics[distribution$criterion,colnames(EffectsTableRow),] <- t(EffectsTableRow)
    }
  }
  summaryStatistics
}

summaryStatistics.absolute <- function(distribution) {
  analytical <- c("dbeta","dnorm","exact","empty")
  if (distribution$performance[["type"]] %in% analytical) { 
    summaryStatistics.absolute.analytical(distribution)
  } else {
    summaryStatistics.absolute.sample(distribution)
  }
}

summaryStatistics.absolute.analytical <- function(distribution) {
  fn <- paste("summaryStatistics",distribution$performance[["type"]],sep=".")
  do.call(fn,list(distribution$performance))
}

summaryStatistics.dbeta <- function(performance) {
  quantiles <- qbeta(c(0.025,0.5,0.975),performance$parameters['alpha'],performance$parameters['beta'])
  mode <- mode.dbeta(performance) 
  setNamesSummaryStatistics(c(quantiles,mode))
}

summaryStatistics.dnorm <- function(performance) {
  quantiles <- qnorm(c(0.025,0.5,0.975),performance$parameters['mu'],performance$parameters['sigma'])
  mode <- performance$parameters['mu']
  setNamesSummaryStatistics(c(quantiles,mode))
}

summaryStatistics.exact <- function(performance) {
  setNamesSummaryStatistics(rep(as.numeric(performance["value"]),4))
}

summaryStatistics.empty <- function(performance) {
  setNamesSummaryStatistics(rep(NA,4))
}

summaryStatistics.absolute.sample <- function(distribution) {
  N <- 1e4
  samples <- sampler(distribution$performance, N)
  computeSummaryStatisticsFromSample(samples)
}

summaryStatistics.relative.sample <- function(distribution) {
  N <- 1e4
  samples <- sampler(distribution$performance, N)
  apply(samples,2,computeSummaryStatisticsFromSample)
}

computeSummaryStatisticsFromSample <- function(samples) {
  quantiles <- quantile(samples, c(0.025, 0.5, 0.975), na.rm=T)
  if (any(!is.na(samples))) {
    mode <- computeModeFromSample(samples)
  } else {
    mode <- NA
  }
  setNamesSummaryStatistics(c(quantiles,mode))
}

computeModeFromSample <- function(samples) {
  if (min(samples,na.rm=T) != max(samples,na.rm=T)) {
    density <- density(samples)
    mode <- density$x[which.max(density$y)]
  } else {
    mode <- min(samples, na.rm=T)
  }
  mode
}

setNamesSummaryStatistics <- function(summaryStatistics) {
  names(summaryStatistics) <- c("2.5%","50%","97.5%","mode")
  summaryStatistics
}

mode.dbeta <- function(perf) {
  alpha <- as.numeric(perf$parameters['alpha'])
  beta <- as.numeric(perf$parameters['beta'])
  mode <- (alpha - 1)/(alpha + beta - 2)
  if (alpha<1 && beta<1) {
    mode <- NA
  }
  if ( (alpha<1 && beta>=1) || (alpha==1 && beta>1) ) {
    mode <- 0
  }
  if ( (alpha>=1 && beta<1) || (alpha>1 && beta==1) ) {
    mode <- 1
  }
  if (alpha==1 && beta==1) {
    mode <- NA
  }
  mode
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
