test_that("getCoordinatesForCutoffs should return coordinates for cutoffs", {
  cutoffs <- list(
    "x" = c(5),
    "y" = c(5)
  )
  getDifferenceWithReference <- function(x, y) {
    0
  }
  ranges <- list(
    "x" = c(0, 10),
    "y" = c(0, 10)
  )

  result <- getCoordinatesForCutoffs(cutoffs, getDifferenceWithReference, ranges)
  expectedResult <- list(
    "xForY" = c(0),
    "yForX" = c(0)
  )
  expect_that(result, equals(expectedResult))
})