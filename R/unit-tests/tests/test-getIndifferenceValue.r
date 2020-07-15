test_that("getIndifferenceValue returns ..", {
  weights <- data.frame("criterionId1"= 1, "criterionId2" = 2)
 
  criteria <- list(
    "x" = "criterionId1",
    "y" = "criterionId2"
  )
  pvfsByCriterion <- list(
    "criterionId1" = function(x,y) {
      1
    },
    "criterionId2" = function(x,y) {
      1
    }
  )
  referencePoint <- c(1,1)
  result <- getIndifferenceValue(weights, criteria, pvfsByCriterion, referencePoint)
  expectedResult <- 3
  expect_that(result, equals(expectedResult))
})