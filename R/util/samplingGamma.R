sampler.dgamma <- function(performance, N) {
  return(rgamma(N, performance$parameters[['alpha']], performance$parameters[['beta']]))
}
