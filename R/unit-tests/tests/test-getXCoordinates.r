test_that("getXCoordinates should return the X coordinates for a linear PVF", {
  pvf <- list(
    "type" = "linear",
    "range" = c(1,2)
  )
  result <- getXCoordinates(pvf)
  expectedResult <- c(1,2)
  expect_that(result, equals(expectedResult))
})

test_that("getXCoordinates should return the X coordinates for a non-linear PVF", {
  pvf <- list(
    "type" = "piece-wise-linear",
    "range" = c(1,4),
    "cutoffs" = c(2,3)
  )
  result <- getXCoordinates(pvf)
  expectedResult <- c(1,2,3,4)
  expect_that(result, equals(expectedResult))
})