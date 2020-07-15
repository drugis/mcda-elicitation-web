generateSummaryStatistics <- function(params) {
  crit <- names(params$criteria)
  alts <- names(params$alternatives)
  performanceTable <- params$performanceTable
  reportedProperties <- c("2.5%","50%","97.5%","mode")
  summaryStatistics <- array(dim=c(length(crit),length(alts), length(reportedProperties)), dimnames=list(crit, alts, reportedProperties))
  for (distribution in performanceTable) {
    isAbsolutePerformance <- !is.null(distribution$alternative)
    if (isAbsolutePerformance) {
      summaryStatistics[distribution$criterion, distribution$alternative, ] <- summaryStatistics.absolute(distribution)
    } else {
      sortedAlts <- distribution$performance$parameters$relative$cov$rownames
      summaryStatistics[distribution$criterion, sortedAlts, ] <- summaryStatistics.relative(distribution)
    }
  }
  return(summaryStatistics)
}

summaryStatistics.absolute <- function(distribution) {
  analyticalPerformanceTypes <- c("dbeta", "dnorm", "range", "exact", "empty")
  canCalculateSummaryStastisticsAnalytically <- distribution$performance[["type"]] %in% analyticalPerformanceTypes
  if (canCalculateSummaryStastisticsAnalytically) { 
    return(summaryStatistics.absolute.analytical(distribution))
  } else {
    return(summaryStatistics.absolute.sample(distribution))
  }
}

summaryStatistics.absolute.analytical <- function(distribution) {
  fn <- paste("summaryStatistics", distribution$performance[["type"]], sep=".")
  return(do.call(fn, list(distribution$performance)))
}

summaryStatistics.dbeta <- function(performance) {
  quantiles <- qbeta(c(0.025,0.5,0.975),performance$parameters['alpha'],performance$parameters['beta'])
  mode <- mode.dbeta(performance) 
  return(setNamesSummaryStatistics(c(quantiles,mode)))
}

summaryStatistics.dnorm <- function(performance) {
  quantiles <- qnorm(c(0.025,0.5,0.975),performance$parameters['mu'],performance$parameters['sigma'])
  mode <- performance$parameters['mu']
  return(setNamesSummaryStatistics(c(quantiles,mode)))
}

summaryStatistics.range <- function(performance) {
  quantiles <- performance$parameters['lowerBound'] + qunif(c(0.025,0.5,0.975))*(performance$parameters['upperBound'] - performance$parameters['lowerBound'])
  mode <- NA
  return(setNamesSummaryStatistics(c(quantiles,mode)))
}

summaryStatistics.exact <- function(performance) {
  return(setNamesSummaryStatistics(rep(as.numeric(performance["value"]),4)))
}

summaryStatistics.empty <- function(performance) {
  return(setNamesSummaryStatistics(rep(NA,4)))
}

summaryStatistics.absolute.sample <- function(distribution) {
  N <- 1e4
  samples <- sampler(distribution$performance, N)
  return(computeSummaryStatisticsFromSample(samples))
}

summaryStatistics.relative <- function(distribution) {
  N <- 1e4
  samples <- sampler(distribution$performance, N)
  return(t(apply(samples,2,computeSummaryStatisticsFromSample)))
}

computeSummaryStatisticsFromSample <- function(samples) {
  quantiles <- quantile(samples, c(0.025, 0.5, 0.975), na.rm=T)
  if (any(!is.na(samples))) {
    mode <- computeModeFromSample(samples)
  } else {
    mode <- NA
  }
  return(setNamesSummaryStatistics(c(quantiles,mode)))
}

computeModeFromSample <- function(samples) {
  if (min(samples,na.rm=T) != max(samples, na.rm=T)) {
    density <- density(samples)
    mode <- density$x[which.max(density$y)]
  } else {
    mode <- min(samples, na.rm=T)
  }
  return(mode)
}

setNamesSummaryStatistics <- function(summaryStatistics) {
  names(summaryStatistics) <- c("2.5%","50%","97.5%","mode")
  return(summaryStatistics)
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
  return(mode)
}
