wrapMatrix <- function(matrix) {
  alternativeTitles <- rownames(matrix)
  resultingList <- lapply(alternativeTitles, function(alternativeTitle) { matrix[alternativeTitle,] })
  names(resultingList) <- alternativeTitles
  return(resultingList)
}

getSelectedCriteria <- function(selectedCriteria) {
  criteria <- list(
    "x" = selectedCriteria$criterionX,
    "y" = selectedCriteria$criterionY
  )
  return(criteria)
}

logit <- function(x) {
  return(log(x/(1-x)))
}

cloglog <- function(x) {
  return(log(-log(1-x)))
}
