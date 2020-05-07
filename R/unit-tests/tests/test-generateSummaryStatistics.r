test_that("generateSummaryStatistics ..", {
  params <- list(
    "criteria" = list(
      "criterionId1" = list(),
      "criterionId2" = list()
    ),
    "alternatives" = list(
      "alternativeId1" = list(
        "title" = "Alternative 1"
      ),
      "alternativeId2" = list(
        "title" = "Alternative 2"
      )
    ),
    "performanceTable" = list(
      list(
        "alternative" = "alternativeId1",
        "criterion" = "criterionId1",
        "performance" = list(
          "type" = "exact",
          "value" = 1.5
        )
      ),
      list(
        "alternative" = "alternativeId2",
        "criterion" = "criterionId1",
        "performance" = list(
          "type" = "exact",
          "value" = 0.5
        )
      ),
      list(
        "alternative" = "alternativeId1",
        "criterion" = "criterionId2",
        "performance" = list(
          "type" = "exact",
          "value" = 1.0
        )
      ),
      list(
        "alternative" = "alternativeId2",
        "criterion" = "criterionId2",
        "performance" = list(
          "type" = "exact",
          "value" = 0.75
        )
      )
    )
  )

  result <- generateSummaryStatistics(params)
  expectedResult <- array(dim = c(2, 2, 4), dimnames = list(
    c("criterionId1", "criterionId2"),
    c("alternativeId1", "alternativeId2"),
    c("2.5%", "50%", "97.5%", "mode")
  ))
  expectedResult["criterionId1", "alternativeId1",] <- c("2.5%" = 1.5, "50%" = 1.5, "97.5%" = 1.5, "mode" = 1.5)
  expectedResult["criterionId1", "alternativeId2",] <- c("2.5%" = 0.50, "50%" = 0.50, "97.5%" = 0.50, "mode" = 0.50)
  expectedResult["criterionId2", "alternativeId1",] <- c("2.5%" = 1.0, "50%" = 1.0, "97.5%" = 1.0, "mode" = 1.0)
  expectedResult["criterionId2", "alternativeId2",] <- c("2.5%" = 0.75, "50%" = 0.75, "97.5%" = 0.75, "mode" = 0.75)

  expect_that(result, equals(expectedResult))
})