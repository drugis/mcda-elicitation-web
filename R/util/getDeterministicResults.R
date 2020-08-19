# import wrapMatrix from util.R
# import genRepresentativeWeights from weights.R

getDeterministicResults <- function(params, measurements) {
  if (!is.null(params[["weights"]])) {
    weights <- params[["weights"]]
  } else {
    weights <- genWeightsQuantiles(params)
  }
  valueProfiles <- calculateValueProfiles(params, measurements, weights[['mean']])
  totalValue <- rowSums(valueProfiles)

  results <- list(
      "weights" = weights,
      "value" = wrapMatrix(valueProfiles),
      "total" = totalValue)
  return(results)
}
