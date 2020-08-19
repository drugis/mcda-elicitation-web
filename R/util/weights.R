# import hitAndRunSamples from constants.R
# import genHARconstraint from constraint.R

genRepresentativeWeights <- function(params) {
  criteria <- names(params$criteria)
  weights <- sampleWeights(params$preferences, criteria)
  representativeWeights <- colMeans(weights)
  names(representativeWeights) <- criteria
  return(representativeWeights)
}

genWeightsQuantiles <- function(params) {
  if (!is.null(params[["weights"]])) {
    return(params[["weights"]])
  } else {
    criteria <- names(params$criteria)
    weights <- sampleWeights(params$preferences, criteria)
    weightsQuantiles <- getWeightsQuantiles(weights)
    return(weightsQuantiles)
  }
}

sampleWeights <- function(preferences, criteria) {
  numberOfCriteria <- length(criteria)
  constraints <- mergeConstraints(lapply(preferences, genHARconstraint, crit = criteria))
  constraints <- mergeConstraints(simplexConstraints(numberOfCriteria), constraints)
  weights <- hitandrun(constraints, n.samples = hitAndRunSamples)
  colnames(weights) <- criteria
  return(weights)
}
