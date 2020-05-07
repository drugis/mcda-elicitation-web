genHARconstraint <- function(statement, criteria) {
  numberOfCriteria <- length(criteria)
  index1 <- which(criteria == statement$criteria[1])
  index2 <- which(criteria == statement$criteria[2])

  if (statement$type == "ordinal") {
    return(ordinalConstraint(numberOfCriteria, index1, index2))
  } else if (statement$type == "ratio bound") {
    return(getRatioBoundConstraint(statement$bounds, numberOfCriteria, index1, index2))
  } else if (statement$type == "exact swing") {
    return(getRatioConstraint(numberOfCriteria, index1, index2, statement$ratio))
  }
}

getRatioConstraint <- function(numberOfCriteria, index1, index2, value) {
  array <- rep(0, numberOfCriteria)
  array[index1] <- -1
  array[index2] <- value
  constraints <- list(
    "constr" = t(array),
    "rhs" = c(0),
    "dir" = c("=")
  )
  return(constraints)
}

getRatioBoundConstraint <- function(bounds, numberOfCriteria, index1, index2) {
  lowerBound <- bounds[1]
  upperBound <- bounds[2]
  return(mergeConstraints(
    lowerRatioConstraint(numberOfCriteria, index1, index2, lowerBound),
    upperRatioConstraint(numberOfCriteria, index1, index2, upperBound)
  ))
}
