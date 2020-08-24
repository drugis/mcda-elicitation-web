test_that("run_representativeWeights return representative weights", {
  params <- list(
    "criteria" = list(
      "criterionId1" = list(
        pvf = list(
          direction = "increasing",
          range = c(0.5, 1.5),
          type = "linear"
        )
      ),
      "criterionId2" = list(
        pvf = list(
          direction = "increasing",
          range = c(0.75, 1.0),
          type = "linear"
        )
      )
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
    ),
    "preferences" = c()
  )

  result <- run_representativeWeights(params)
  expect_that(names(result), equals(c("criterionId1", "criterionId2")))
})