# import createPvf from pvf.R

calculateValueProfiles <- function(params, measurements, weights) {
  pvf <- lapply(params$criteria, createPvf)
  for (criterion in names(params$criteria)) {
    measurements[, criterion] <- pvf[[criterion]](measurements[, criterion]) * weights[[criterion]]
  }
  return(measurements)
}
