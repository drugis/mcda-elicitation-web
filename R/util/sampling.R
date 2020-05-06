sample <- function(alternatives, criteria, performanceTable, N) {
  measurements <- array(dim=c(N,length(alternatives), length(criteria)), dimnames=list(NULL, alternatives, criteria))
  for (measurement in performanceTable) {
    measurements <- assignSample(measurement, measurements)
  }
  return(measurements)
}

assignSample <- function(performanceEntry, samples) {
  if (!is.null(performanceEntry$alternative)) { 
    return(getAbsoluteEstimates(samples, performanceEntry))
  } else {
    return(getRelativeEstimates(samples, performanceEntry))
  }
}

getAbsoluteEstimates <- function(samples, performanceEntry) {
   N <- dim(samples)[1]
   samples[, performanceEntry$alternative, performanceEntry$criterion] <- sampler(performanceEntry$performance, N)
   return(samples)
}

getRelativeEstimates <- function(samples, performanceEntry) {
  N <- dim(samples)[1]
  values <- sampler(performanceEntry$performance, N) 
  samples[, colnames(values), performanceEntry$criterion] <- values
  return(samples)
}

sampler <- function(performance, N) {
  fn <- paste('sampler', gsub('-', '_', performance[['type']]), sep='.')
  return(do.call(fn, list(performance, N)))
}
