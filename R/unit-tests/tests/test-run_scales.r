test_that("run_scales returns scales for criterion/alternative pairs", {
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

  result <- run_scales(params)
  expectedResult <- list(
    "criterionId1" = list(
      "alternativeId1" = c(
        "2.5%" = 1.5,
        "50%" = 1.5,
        "97.5%" = 1.5,
        "mode" = 1.5
      ),
      "alternativeId2" = c(
        "2.5%" = 0.5,
        "50%" = 0.5,
        "97.5%" = 0.5,
        "mode" = 0.5
      )
    ),
    "criterionId2" = list(
      "alternativeId1" = c(
        "2.5%" = 1,
        "50%" = 1,
        "97.5%" = 1,
        "mode" = 1
      ),
      "alternativeId2" = c(
        "2.5%" = 0.75,
        "50%" = 0.75,
        "97.5%" = 0.75,
        "mode" = 0.75
      )
    )
  )
  expect_that(result, equals(expectedResult))
})