test_that("wrapMatrix converts a 2D matrix of scales to a list keyed by alternatives", {
  matrix <- array(dim = c(2, 4), dimnames = list(
    c("alternativeId1", "alternativeId2"),
    c("2.5%", "50%", "97.5%", "mode")
  ))
  matrix["alternativeId1",] <- c("2.5%" = 1.5, "50%" = 1.5, "97.5%" = 1.5, "mode" = 1.5)
  matrix["alternativeId2",] <- c("2.5%" = 0.50, "50%" = 0.50, "97.5%" = 0.50, "mode" = 0.50)

  result <- wrapMatrix(matrix)
  expectedResult <- list(
    "alternativeId1" = c("2.5%" = 1.5, "50%" = 1.5, "97.5%" = 1.5, "mode" = 1.5),
    "alternativeId2" = c("2.5%" = 0.50, "50%" = 0.50, "97.5%" = 0.50, "mode" = 0.50)
  )
  expect_that(result, equals(expectedResult))
})