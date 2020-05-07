test_that("getCutoffs returns a list cutoffs for the selected criteria", {
  params <- list(
    criteria = list(
      "criterionXId" = list(
        "pvf" = list(
          "type" = "linear",
          "range" = c(1,2)
        )
      ),
      "criterionYId" = list(
        "pvf" = list(
          "type" = "piece-wise-linear",
          "range" = c(1,4),
          "cutoffs" = c(2,3)
        )
      )
    )
  )
  criteria <- list(
    "x" = "criterionXId",
    "y" = "criterionYId"
  )
  result <- getCutoffs(params, criteria)
  expectedResult <- list(
    "x" = c(1,2),
    "y" = c(1,4,2,3)
  )
  expect_that(result, equals(expectedResult))
})