sampler.range <- function(performance, N) { 
  return(performance$parameters['lowerBound'] + runif(N)*(performance$parameters['upperBound'] - performance$parameters['lowerBound']))
}
