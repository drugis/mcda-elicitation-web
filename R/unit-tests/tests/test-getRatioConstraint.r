test_that("getRatioConstraint should return a list with ratio constraints", {
  numberOfCriteria <- 3
  index1 <- 1
  index2 <- 3
  value <- 10
  result <- getRatioConstraint(numberOfCriteria, index1, index2, value)
  expectedResult <- list(
    "constr" = t(c(-1,0,10)),
    "rhs" = 0,
    "dir" = "="
  )
  expect_that(result, equals(expectedResult))
})