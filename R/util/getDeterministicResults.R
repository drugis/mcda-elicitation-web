# import wrapMatrix from util.R
# import genRepresentativeWeights from weights.R

getDeterministicResults <- function(params, measurements) {
  weights <- genRepresentativeWeights(params)
  valueProfiles <- calculateValueProfiles(params, measurements, weights)
  totalValue <- rowSums(valueProfiles)

  results <- list(
      "weights" = weights,
      "value" = wrapMatrix(valueProfiles),
      "total" = totalValue)
  return(results)
}
