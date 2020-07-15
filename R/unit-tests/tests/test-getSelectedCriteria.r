test_that("getSelectedCriteria returns a list of selected criteria", {
  selectedCriteria <- list(
    "criterionX" = "criterionId1",
    "criterionY" = "criterionId2"
  )
  result <- getSelectedCriteria(selectedCriteria)
  expectedResult <- list(
    "x" = selectedCriteria$criterionX,
    "y" = selectedCriteria$criterionY
  )
  expect_that(result, equals(expectedResult))
})