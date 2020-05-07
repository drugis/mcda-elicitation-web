# import sample form sampler.R
# import createPvf from pvf.R

createPvf <- function(criterion) {
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
    values <- c(0, values, 1)
    y <- c(worst, cutoffs, best)
  } else {
    # Decreasing
    values <- c(1, values, 0)
    y <- c(best, cutoffs, worst)
  }
  return(function(x) {
    return(smaa.pvf(x, y, values, outOfBounds="interpolate"))
  })
}

sample.partialValues <- function(params, N) {
  pvf <- lapply(params$criteria, createPvf);
  measurements <- sample(names(params$alternatives), names(params$criteria), params$performanceTable, N)
  for (criterion in names(params$criteria)) {
    measurements[,,criterion] <- pvf[[criterion]](measurements[,,criterion])
  }
  return(measurements)
}
