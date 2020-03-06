sampler.dt <- function(performance, N) {
  return(performance$parameters['mu'] + performance$parameters['stdErr'] * rt(N, performance$parameters['dof']))
}
