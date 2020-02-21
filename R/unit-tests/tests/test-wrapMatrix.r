test_that("wrapMatrix converts a matrix into a list transposing the data", {
  matrix <- array(c(1,2,3,4), dim=c(2,2), dimnames=list(list("dim11","dim12"), list("dim21","dim22")))
  result <- wrapMatrix(matrix)
  expectedResult <- list(
    "dim11" = c("dim21"=1, "dim22"=3),
    "dim12" = c("dim21"=2, "dim22"=4)
  )
  expect_that(result, equals(expectedResult))
})