test_that("genHARconstraint return constraint for ordinal weighing", {
  statement <- list(
    "type" = "ordinal",
    "criteria" = list("criterionId1", "criterionId2")
  )
  criteria <- c("criterionId1", "criterionId2")

  result <- genHARconstraint(statement, criteria)
  constraintArray <- array(c(-1,1), dim=c(1,2))
  expectedResult <- list(
    "constr" = constraintArray,
    "rhs" = c(0),
    "dir" = c("<=")
  )
  expect_that(result, equals(expectedResult))
})

test_that("genHARconstraint return constraint for ratio bound weighing", {
  statement <- list(
    "type" = "ratio bound",
    "criteria" = list("criterionId1", "criterionId2"),
    "bounds" = c(0,1)
  )
  criteria <- c("criterionId1", "criterionId2")

  result <- genHARconstraint(statement, criteria)
  constraintArray <- array(c(-1,1,0,-1), dim=c(2,2))
  expectedResult <- list(
    "constr" = constraintArray,
    "rhs" = c(0, 0),
    "dir" = c("<=", "<=")
  )
  expect_that(result, equals(expectedResult))
})

test_that("genHARconstraint return constraint for exact swing weighing", {
  statement <- list(
    "type" = "exact swing",
    "criteria" = list("criterionId1", "criterionId2"),
    "ratio" = c(0.5)
  )
  criteria <- c("criterionId1", "criterionId2")

  result <- genHARconstraint(statement, criteria)
  constraintArray <- array(c(-1,0.5), dim=c(1,2))
  expectedResult <- list(
    "constr" = constraintArray,
    "rhs" = c(0),
    "dir" = c("=")
  )
  expect_that(result, equals(expectedResult))
})