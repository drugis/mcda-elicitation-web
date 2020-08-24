test_that("run_deterministic return results of deterministic analysis", {
  set.seed(1234)
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
    )
  )

  result <- run_deterministic(params)

  expectedWeights <- c("criterionId1" = 0.4985817, "criterionId2" = 0.5014183)
  expectedTotal <- c("alternativeId1" = 1, "alternativeId2" = 0)

  expect_that(result$weights, equals(expectedWeights))
  expect_gt(result$value[["alternativeId1"]][["criterionId1"]], 0)
  expect_gt(result$value[["alternativeId1"]][["criterionId2"]], 0)
  expect_that(result$value[["alternativeId2"]][["criterionId1"]], equals(0))
  expect_that(result$value[["alternativeId2"]][["criterionId2"]], equals(0))
  expect_that(result$total, equals(expectedTotal))
})