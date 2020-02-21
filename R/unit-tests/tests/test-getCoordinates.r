test_that("getCoordinates returns for cutoffs inside the ranges", {
  cutOffs <- list(
    "x"=c(1,2),
    "y"=c(3,4)
  )
  coordinatesForCutoffs <- list(
    "yForX"=c(1,2),
    "xForY"=c(2,3)
  )
  ranges <- list(
    "x"=c(1,3),
    "y"=c(1,3)
  )
  result <- getCoordinates(cutOffs, coordinatesForCutoffs, ranges)
  expectedResult <- data.frame(
    "x" = c(1,2,2),
    "y" = c(1,2,3)
  )
  expect_that(result, equals(expectedResult))
})