# import logit from util.R
# import cloglog from util.R

sampler.dbeta <- function(performance, N) {
  return(rbeta(N, performance$parameters['alpha'], performance$parameters['beta']))
}

sampler.dbeta_cloglog <- function(performance, N) {
  return(cloglog(rbeta(N, performance$parameters['alpha'], performance$parameters['beta'])))
}

sampler.dbeta_logit <- function(performance, N) {
  return(logit(rbeta(N, performance$parameters['alpha'], performance$parameters['beta'])))
}
