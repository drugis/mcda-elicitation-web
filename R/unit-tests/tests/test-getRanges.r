test_that("getSelectedCriteria returns a list of ranges for selected criteria", {
  selectedCriteria <- list(
    "x" = "criterionId1",
    "y" = "criterionId2"
  )
  criteria <- list(
    "criterionId1" = list(
      "pvf" = list(
        "range" = c(0,10)
      )
    ),
    "criterionId2" = list(
      "pvf" = list(
        "range" = c(-10,0)
      )
    )
  )
  result <- getRanges(criteria, selectedCriteria)
  expectedResult <- list(
    "x" = c(0,10),
    "y" = c(-10,0)
  )
  expect_that(result, equals(expectedResult))
})