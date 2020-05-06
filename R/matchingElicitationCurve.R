# import getSelectedCriteria from util.R
# import createPvf from pvf.R

run_matchingElicitationCurve <- function(params) {
  criteria <- getSelectedCriteria(params$indifferenceCurve)
  weight <- getMatchingWeight(params, criteria$y)

  params$preferences <- list(list(
    type = 'exact swing',
    ratio = weight,
    criteria = c(criteria$x, criteria$y))
  )

  coordinates <- run_indifferenceCurve(params)

  result <- list(
    "x" = coordinates$x,
    "y" = coordinates$y,
    "weight" = weight
  )
  return(result)
}

getMatchingWeight <- function(params, criterionY) {
  pvf <- createPvf(params$criteria[[criterionY]])
  chosenY <- params$indifferenceCurve$chosenY
  if (!is.null(params$criteria[[criterionY]]$isFavorable) && !params$criteria[[criterionY]]$isFavorable) {
    return(1 - pvf(chosenY))
  } else {
    return(pvf(chosenY))
  }
}
