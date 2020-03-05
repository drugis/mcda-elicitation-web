test_that("genMedianMeasurements return median measurements where criteria are rows", {
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

  result <- genMedianMeasurements(params)
  expectedResult <- array(
    dim = c(2, 2), 
    dimnames = list(
      c("alternativeId1", "alternativeId2"),
      c("criterionId1", "criterionId2")
      )
    )
  expectedResult["alternativeId1", "criterionId1"] <- 1.5
  expectedResult["alternativeId1", "criterionId2"] <- 1.0
  expectedResult["alternativeId2", "criterionId1"] <- 0.5
  expectedResult["alternativeId2", "criterionId2"] <- 0.75
  expect_that(result, equals(expectedResult))
})