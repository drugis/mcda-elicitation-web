run_choiceBasedMatching <- function(params) {
  numberOfCriteria <- length(params[['criteria']])
  criterionIds <- c()
  for (criterion in params[['criteria']]) {
    criterionIds <- append(criterionIds, criterion[['id']])
  }

  pvf <- lapply(params[['criteria']], createPvf)
  names(pvf) <- criterionIds

  constraintsFromHistory <- generateConstraintsFromHistory(params, criterionIds, pvf)
  edgeLengths <- calculateEdgeLengths(constraintsFromHistory)

  fromR <- params

  if (isDoneEliciting(params)) {
    fromR[['preferences']] <- retrieveUpperBoundConstraints(constraintsFromHistory, numberOfCriteria, criterionIds)
  } else {
    nextQuestion <- generateNextQuestion(params, constraintsFromHistory, edgeLengths, criterionIds, pvf)
    fromR[['answersAndQuestions']] <- append(fromR[['answersAndQuestions']], list(list(question = nextQuestion)))
  }
  return(fromR)
}

isDoneEliciting <- function(params) {
  numberOfCriteria <- length(params[['criteria']])
  numberOfAnswers <- length(params[['answersAndQuestions']])
  if (numberOfCriteria <= 4) {
    return(numberOfAnswers == (numberOfCriteria - 1) * 4)
  } else {
    return(numberOfAnswers == (numberOfCriteria - 2) * 4)
  }
}

retrieveUpperBoundConstraints <- function(constraint, numberOfCriteria, criterionIds) {
  numberOfUpperBoundConstraints <- nrow(constraint[['constr']]) - (numberOfCriteria + 1)
  preferences <- vector("list", numberOfUpperBoundConstraints)
  for (index in 1:numberOfUpperBoundConstraints) {
    criteria <- getCriteriaWithConstraints(criterionIds, constraint, index, numberOfCriteria)
    bound <- getBound(constraint, index, numberOfCriteria)
    preferences[[index]] <- list(type = "upper ratio", elicitationMethod = "choice", criteria = criteria, bound = bound)
  }
  return(preferences)
}

getCriteriaWithConstraints <- function(criterionIds, constraint, index, numberOfCriteria) {
  criterion1Id <- criterionIds[getConstraint(constraint, index, numberOfCriteria) > 0]
  criterion2Id <- criterionIds[getConstraint(constraint, index, numberOfCriteria) < 0]
  return(c(criterion1Id, criterion2Id))
}

getBound <- function(constraint, index, numberOfCriteria) {
  bound <- -1 * constraint[['constr']][index + (numberOfCriteria + 1), getConstraint(constraint, index, numberOfCriteria) < 0] /
    constraint[['constr']][index + (numberOfCriteria + 1), getConstraint(constraint, index, numberOfCriteria) > 0]
  return(bound)
}

getConstraint <- function(constraint, index, numberOfCriteria) {
  return(constraint[['constr']][index + (numberOfCriteria + 1),])
}

generateNextQuestion <- function(params, constraints, edgeLengths, criterionIds, pvf) {
  criterionIdsEdgeIndices <- calculateEdgeIndices(edgeLengths)
  criterionIdsEdge <- criterionIds[criterionIdsEdgeIndices]
  cutPoint <- calculateCutPoint(constraints, criterionIdsEdgeIndices)

  alternativeA <- rep(0, 2)
  names(alternativeA) <- c("criterion1Value", "criterion2Value")
  alternativeB <- alternativeA

  criterion1Range <- params[['criteria']][[which(criterionIds == criterionIdsEdge[1])]][['pvf']][['range']]
  criterion2Range <- params[['criteria']][[which(criterionIds == criterionIdsEdge[2])]][['pvf']][['range']]

  alternativeA['criterion1Value'] <- selectQuestionValueFromRange(params, criterionIds, criterionIdsEdge[1], criterion1Range, 1, 2)
  alternativeB['criterion1Value'] <- selectQuestionValueFromRange(params, criterionIds, criterionIdsEdge[1], criterion1Range, 2, 1)

  alternativeA['criterion2Value'] <- selectQuestionValueFromRange(params, criterionIds, criterionIdsEdge[2], criterion2Range, 2, 1)
  alternativeB['criterion2Value'] <- selectQuestionValueFromRange(params, criterionIds, criterionIdsEdge[2], criterion2Range, 1, 2)

  if (cutPoint >= 1) {
    alternativeB['criterion1Value'] <- calculateQuestionValue(pvf, criterionIdsEdge[1], 1 / cutPoint, criterion1Range)
  } else {
    alternativeA['criterion2Value'] <- calculateQuestionValue(pvf, criterionIdsEdge[2], cutPoint, criterion2Range)
  }

  isFirstAlternativeA <- runif(1) <= 0.5
  if (isFirstAlternativeA) {
    question <- list(A = alternativeA, B = alternativeB, criterionIds = criterionIdsEdge)
  } else {
    question <- list(A = alternativeB, B = alternativeA, criterionIds = criterionIdsEdge)
  }
  return(question)
}

calculateEdgeIndices <- function(edgeLengths) {
  candidateEdges <- which(edgeLengths == max(edgeLengths), arr.ind = T)
  edge <- sample.int(nrow(candidateEdges), 1)
  criterionIdsEdgeIndices <- c(min(candidateEdges[edge,]), max(candidateEdges[edge,]))
  return(criterionIdsEdgeIndices)
}

calculateCutPoint <- function(constraints, criterionIdsEdgeIndices) {
  samples <- hitandrun(constraints, 1e2)
  cutPoint <- median(samples[, criterionIdsEdgeIndices[1]] / samples[, criterionIdsEdgeIndices[2]])
  return(cutPoint)
}

selectQuestionValueFromRange <- function(params, criterionIds, criterionId, criterionRange, index1, index2) {
  if (params[['criteria']][[which(criterionIds == criterionId)]][['pvf']][['direction']] == "increasing") {
    value <- criterionRange[index1]
  } else {
    value <- criterionRange[index2]
  }
  return(value)
}

calculateQuestionValue <- function(pvf, criterionId, cutPointValue, criterionRange) {
  value <- uniroot(f = function(x) { pvf[[criterionId]](x) - cutPointValue }, interval = criterionRange)[['root']]
  stepSize <- 10 ^ floor(log10(diff(criterionRange)) - 1)
  roundedValue <- round(value / stepSize, 0) * stepSize
  return(roundedValue)
}

generateConstraintsFromHistory <- function(params, criterionIds, pvf) {
  numberOfCriteria <- length(params[['criteria']])
  constraints <- simplexConstraints(numberOfCriteria)
  if (length(params[['answersAndQuestions']]) > 0) {
    for (answerAndQuestion in params[['answersAndQuestions']]) {
      currentQuestionConstraint <- generateCurrentQuestionConstraint(answerAndQuestion, numberOfCriteria, criterionIds, pvf)
      constraints <- mergeConstraints(constraints, currentQuestionConstraint)
    }
  }
  return(constraints)
}

generateCurrentQuestionConstraint <- function(answerAndQuestion, numberOfCriteria, criterionIds, pvf) {
  currentQuestionConstraint <- rep(0, numberOfCriteria)

  criterionId1 <- which(answerAndQuestion[['question']][['criterionIds']][1] == criterionIds)
  currentQuestionConstraint[criterionId1] <- calculateConstraint(pvf, criterionId1, answerAndQuestion, "criterion1Value")

  criterionId2 <- which(answerAndQuestion[['question']][['criterionIds']][2] == criterionIds)
  currentQuestionConstraint[criterionId2] <- calculateConstraint(pvf, criterionId2, answerAndQuestion, "criterion2Value")

  if (answerAndQuestion[['answer']] == "B") {
    currentQuestionConstraint <- -1 * currentQuestionConstraint
  }
  currentQuestionConstraint <- list(constr = currentQuestionConstraint, dir = "<=", rhs = 0)
  return(currentQuestionConstraint)
}

calculateConstraint <- function(pvf, criterionId, answerAndQuestion, criterionSelector) {
  constraint <- pvf[[criterionId]](answerAndQuestion[['question']][['B']][criterionSelector]) - pvf[[criterionId]](answerAndQuestion[['question']][['A']][criterionSelector])
  return(constraint)
}

euclideanDistance <- function(x, y) {
  stopifnot(length(x) == length(y))
  result <- sqrt(sum((x - y) ^ 2))
  return(result)
}

caculateRatioBounds <- function(constr, index1, index2) {
  # Guide on how to transform the constraint set to maximize or minimize a weight ratio wi/wj: http://lpsolve.sourceforge.net/5.1/ratio.htm 
  A <- cbind(-constr[['rhs']], constr[['constr']])
  b <- rep(0, length(constr[['rhs']]))
  tranformedConstraint <- list(constr = A, rhs = b, dir = constr[['dir']])

  c <- rep(0, ncol(constr[['constr']]))
  c[index2] <- 1
  cTransformed <- c(0, c)
  y0Constr <- list(constr = cTransformed, rhs = 1, dir = "=")

  tranformedConstraint <- mergeConstraints(tranformedConstraint, y0Constr)
  hrepTransformed <- makeH(a1 = tranformedConstraint[['constr']][tranformedConstraint[['dir']] == "<=",], b1 = tranformedConstraint[['rhs']][tranformedConstraint[['dir']] == "<="],
                            a2 = tranformedConstraint[['constr']][tranformedConstraint[['dir']] == "=",], b2 = tranformedConstraint[['rhs']][tranformedConstraint[['dir']] == "="])

  objectiveFunction <- rep(0, length(cTransformed))
  objectiveFunction[index1 + 1] <- 1

  # Obtain upper bound for wi/wj
  upper <- lpcdd(hrepTransformed, objectiveFunction, minimize = F)
  if (upper[['solution.type']] == "Optimal") {
    weightsUpper <- upper[['primal.solution']][2:length(upper[['primal.solution']])] / upper[['primal.solution']][1]
    upperRatioBound <- weightsUpper[index1] / weightsUpper[index2]
  } else {
    upperRatioBound <- Inf
  }

  # Obtain lower bound for wi/wj
  lower <- lpcdd(hrepTransformed, objectiveFunction, minimize = T)
  weightsLower <- lower[['primal.solution']][2:length(lower[['primal.solution']])] / lower[['primal.solution']][1]
  lowerRatioBound <- weightsLower[index1] / weightsLower[index2]

  ratioBounds <- c(lowerRatioBound, upperRatioBound)
  return(ratioBounds)
}

obtainAllRatioBounds <- function(constraints) {
  numberOfAttributes <- ncol(constraints[['constr']])
  ratioBounds <- array(dim = c(numberOfAttributes, numberOfAttributes, 2))
  for (index1 in 1:numberOfAttributes) {
    for (index2 in 1:numberOfAttributes) {
      if (index1 == index2) {
        ratioBounds[index1, index2,] <- c(1, 1)
      } else {
        ratioBounds[index1, index2,] <- caculateRatioBounds(constraints, index1, index2)
      }
    }
  }
  return(ratioBounds)
}

calculateEdgeRatioBoundIntersection <- function(numberOfcriteria, index1, index2, bound) {
  # Hyperplane: wi / wj = bound
  # Formulas taken from: https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection

  pointHyperplane <- rep(0, numberOfcriteria) # origin is always on plane
  vertex1 <- pointHyperplane
  vertex1[index1] <- 1
  vertex2 <- pointHyperplane
  vertex2[index2] <- 1

  if (bound == 0) {
    intersectionPoint <- vertex2
  } else {
    if (bound == Inf) {
      intersectionPoint <- vertex1
    } else {
      normalHyperplane <- rep(0, numberOfcriteria)
      normalHyperplane[index1] <- 1
      normalHyperplane[index2] <- -bound
      intersectionPoint <- vertex1 + as.numeric(((pointHyperplane - vertex1) %*% normalHyperplane) / ((vertex1 - vertex2) %*% normalHyperplane)) * (vertex1 - vertex2)
    }
  }
  return(intersectionPoint)
}

calculateEdgeLengths <- function(constraints) {
  numberOfcriteria <- ncol(constraints[['constr']])
  edgeLengths <- matrix(0, nrow = numberOfcriteria, ncol = numberOfcriteria)
  allRatioBounds <- obtainAllRatioBounds(constraints)
  for (index1 in 1:(numberOfcriteria - 1)) {
    for (index2 in (index1 + 1):numberOfcriteria) {
      edgeLengths[index1, index2] <- euclideanDistance(calculateEdgeRatioBoundIntersection(numberOfcriteria, index1, index2, allRatioBounds[index1, index2, 1]), calculateEdgeRatioBoundIntersection(numberOfcriteria, index1, index2, allRatioBounds[index1, index2, 2]))
      edgeLengths[index2, index1] <- edgeLengths[index1, index2]
    }
  }
  return(round(edgeLengths, 3))
}
