sampler.exact <- function(performance, N) {
  return(rep(performance$value, length.out=N))
}
