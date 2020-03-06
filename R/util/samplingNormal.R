sampler.dnorm <- function(performance, N) {
  return(rnorm(N, performance$parameters['mu'], performance$parameters['sigma']))
}
