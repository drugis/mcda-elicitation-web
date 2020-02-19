# Required packages: hitandrun
library(hitandrun)

applyWrapResult <- function(results, descriptions) {
  mapply(wrap.result,
         results,
         descriptions,
         SIMPLIFY = F)
}

wrap.result <- function(result, description) {
  list(data = result, description = description)
}

wrap.matrix <- function(m) {
  l <- lapply(rownames(m), function(name) { m[name,] })
  names(l) <- rownames(m)
  l
}

run_scales <- function(params) {
  apply(generateSummaryStatistics(params), 1, wrap.matrix)
}

ratioConstraint <- function(n, i1, i2, x) {
  a <- rep(0, n)
  a[i1] <- -1
  a[i2] <- x
  list(constr = t(a), rhs = c(0), dir = c("="))
}

run_deterministic <- function(params) {
  measurements <- genMedianMeasurements(params)
  getDeterministicResults(params, measurements)
}

getDeterministicResults <- function(params, measurements) {
  weights <- genRepresentativeWeights(params)
  valueProfiles <- calculateTotalValue(params, measurements, weights)
  totalValue <- rowSums(valueProfiles)

  results <- list(
      "weights" = weights,
      "value" = wrap.matrix(valueProfiles),
      "total" = totalValue)
  descriptions <- list("Representative weights", "Value profile", "Total value")
  applyWrapResult(results, descriptions)
}

run_representativeWeights <- function(params) {
  list(data = genRepresentativeWeights(params), description = "Representative weights")
}

genRepresentativeWeights <- function(params) {
  N <- 1E4
  crit <- names(params$criteria)
  n <- length(crit)
  weights <- sampleWeights(params$preferences, crit, n, N)
  rep.weights <- colMeans(weights)
  names(rep.weights) <- crit
  rep.weights
}

genMedianMeasurements <- function(params) {
  t(generateSummaryStatistics(params)[,, "50%"])
}

genHARconstraint <- function(statement, crit) {
  n <- length(crit)
  i1 <- which(crit == statement$criteria[1])
  i2 <- which(crit == statement$criteria[2])
  if (statement$type == "ordinal") {
    ordinalConstraint(n, i1, i2)
  } else if (statement['type'] == "ratio bound") {
    l <- statement$bounds[1]
    u <- statement$bounds[2]
    mergeConstraints(
      lowerRatioConstraint(n, i1, i2, l),
      upperRatioConstraint(n, i1, i2, u)
    )
  } else if (statement['type'] == "exact swing") {
    ratioConstraint(n, i1, i2, statement$ratio);
  }
}

# Use PVFs to rescale the criteria measurements and multiply by weight to obtain value contributions
calculateTotalValue <- function(params, meas, weights) {
  pvf <- lapply(params$criteria, create.pvf)
  for (criterion in names(params$criteria)) {
    meas[, criterion] <- pvf[[criterion]](meas[, criterion]) * weights[criterion]
  }
  meas
}

run_sensitivityMeasurements <- function(params) {
  measurements <- genMedianMeasurements(params)
  for (entry in params$sensitivityAnalysis$meas) {
    # Replace median value by the desired value for the sensitivity analysis
    measurements[entry$alternative, entry$criterion] <- entry$value
  }
  results <- getDeterministicResults(params, measurements)
  results$weights <- NULL
  results
}

run_sensitivityMeasurementsPlot <- function(params) {
  weights <- genRepresentativeWeights(params)

  meas <- genMedianMeasurements(params)
  alt <- params$sensitivityAnalysis["alternative"]
  crit <- params$sensitivityAnalysis["criterion"]

  range <- params$criteria[[crit]]$pvf$range
  if (params$criteria[[crit]]$pvf$type == 'linear') {
    xCoordinates <- range
  } else {
    xCoordinates <- c(range[1], params$criteria[[crit]]$pvf$cutoffs, range[2])
  }

  total.value <- c()
  for (value in xCoordinates) {
    cur.meas <- meas
    cur.meas[alt, crit] <- value
    total.value <- cbind(total.value, rowSums(calculateTotalValue(params, cur.meas, weights)))
  }

  colnames(total.value) <- xCoordinates
  results <- list(
      "alt" = alt,
      "crit" = crit,
      "total" = wrap.matrix(total.value))
  descriptions <- list("Alternative", "Criterion", "Total value")
  applyWrapResult(results, descriptions)
}

run_sensitivityWeightPlot <- function(params) {
  crit <- params$sensitivityAnalysis["criterion"]

  meas <- genMedianMeasurements(params)
  weights <- genRepresentativeWeights(params)

  index <- which(names(weights) == crit)

  weight.crit <- seq(0, 1, length.out = 101)
  total.value <- c()

  for (value in weight.crit) {

    adjust <- (1 - value) / sum(weights[-index])
    cur.weights <- adjust * weights
    cur.weights[index] <- value

    valueProfiles <- calculateTotalValue(params, meas, cur.weights)
    total.value <- cbind(total.value, rowSums(valueProfiles))

  }

  colnames(total.value) <- weight.crit

  results <- list(
      "crit" = crit,
      "total" = wrap.matrix(total.value))
  descriptions <- list("Criterion", "Total value")
  applyWrapResult(results, descriptions)
}

getCutoffs <- function(params, crit) {
  cutoffs <- params$criteria[[crit]]$pvf$range

  if (params$criteria[[crit]]$pvf$type != "linear") {
    cutoffs <- c(cutoffs, params$criteria[[crit]]$pvf$cutoffs)
  }
  cutoffs
}

run_matchingElicitationCurve <- function(params) {
  criterionX <- params$indifferenceCurve$criterionX
  criterionY <- params$indifferenceCurve$criterionY
  chosenY <- params$indifferenceCurve$chosenY

  pvf <- create.pvf(params[['criteria']][[criterionY]])

  if (!is.null(params[['criteria']][[criterionY]]$isFavorable) && !params[['criteria']][[criterionY]]$isFavorable) {
    weight <- 1 - pvf(chosenY)
  } else {
    weight <- pvf(chosenY)
  }

  params$preferences <- list(list(
    type = 'exact swing',
    ratio = weight,
    criteria = c(criterionX, criterionY))
  )

  result <- run_indifferenceCurve(params)
  result$weight <- weight
  result
}

run_indifferenceCurve <- function(params) {
  criterionX <- params$indifferenceCurve$criterionX
  criterionY <- params$indifferenceCurve$criterionY
  ref.point <- c(params$indifferenceCurve$x, params$indifferenceCurve$y)

  # Value function
  weights <- genRepresentativeWeights(params)
  pvf <- lapply(params$criteria, create.pvf)

  # Value associated with the reference point
  xWeight <- weights[criterionX] * pvf[[criterionX]](ref.point[1])
  yWeight <- weights[criterionY] * pvf[[criterionY]](ref.point[2])
  Indifference.value <- as.numeric(xWeight + yWeight)

  # Difference in value between the reference point and the point (x,y)
  value.difference <- function(x, y) {
    as.numeric(weights[criterionX] * pvf[[criterionX]](x) + weights[criterionY] * pvf[[criterionY]](y) - Indifference.value)
  }

  xCutOffs <- getCutoffs(params, criterionX)
  yCutOffs <- getCutoffs(params, criterionY)

  xRange <- params$criteria[[criterionX]]$pvf$range
  yRange <- params$criteria[[criterionY]]$pvf$range

  yCoordinateForXCutoff <- getYCoordinateForXCutoff(xCutOffs, yCoordinateForXCutoff, value.difference, yRange)
  xCoordinateForYCutoff <- getXCoordinateForYCutOff(yCutOffs, yCoordinateForXCutoff, value.difference, yRange)

  coordinates <- data.frame(x = c(xCutOffs, xCoordinateForYCutoff), y = c(yCoordinateForXCutoff, yCutOffs))
  coordinates <- coordinates[order(coordinates$x),]

  coordinates <- removeCoordinatesOutsideOfRange(coordinates, coordinates$x, xRange)
  coordinates <- removeCoordinatesOutsideOfRange(coordinates, coordinates$y, yRange)
  rownames(coordinates) <- NULL
  wrap.result(coordinates, 'IndifferenceCoordinates')
}

removeCoordinatesOutsideOfRange <- function(coordinates, values, range) {
  epsilon <- 0.001 * (range[2] - range[1]);
  coordinates <- coordinates[values + epsilon >= range[1] & values - epsilon <= range[2],]
  coordinates
}

getYCoordinateForXCutoff <- function(xCutOffs, yCoordinateForXCutoff, value.difference, yRange) {
  yCoordinateForXCutoff <- c()
  for (x in xCutOffs) {
    yCoordinateForXCutoff <- c(yCoordinateForXCutoff, uniroot(f = value.difference, interval = yRange, x = x, extendInt = "yes")$root)
  }
}

getXCoordinateForYCutOff <- function(yCutOffs, xCoordinateForYCutoff, value.difference, yRange) {
  xCoordinateForYCutoff <- c()
  for (y in yCutOffs) {
    xCoordinateForYCutoff <- c(xCoordinateForYCutoff, uniroot(f = value.difference, interval = yRange, y = y, extendInt = "yes")$root)
  }
}

sampleWeights <- function(preferences, crit, n, N) {
  constr <- mergeConstraints(lapply(preferences, genHARconstraint, crit = crit))
  constr <- mergeConstraints(simplexConstraints(n), constr)
  weights <- hitandrun(constr, n.samples = N)
  colnames(weights) <- crit
  weights
}

getSmaaWeights <- function(params, crit, n, N) {
  weights <- sampleWeights(params$preferences, crit, n, N)
  if (!is.null(params$uncertaintyOptions)) {
    if (!params$uncertaintyOptions["weights"]) {
      mean.weights <- colMeans(weights)
      for (i in 1:N) {
        weights[i,] <- mean.weights
      }
    }
  }
  return(weights)
}

getSmaaMeasurements <- function(params, N, crit) {
  meas <- sample.partialValues(params, N)
  if (!is.null(params$uncertaintyOptions)) {
    if (!params$uncertaintyOptions["measurements"]) {
      median.meas <- genMedianMeasurements(params)
      pvf <- lapply(params$criteria, create.pvf)
      for (criterion in crit) {
        median.meas[, criterion] <- pvf[[criterion]](median.meas[, criterion])
      }
      for (i in 1:N) {
        meas[i,,] <- median.meas
      }
    }
  }
  return(meas)
}

getSmaaResults <- function(params) {
  N <- 1E4
  n <- length(params$criteria)
  m <- length(params$alternatives)
  crit <- names(params$criteria)
  alts <- names(params$alternatives)

  weights <- getSmaaWeights(params, crit, n, N)
  meas <- getSmaaMeasurements(params, N, crit)

  utils <- smaa.values(meas, weights)
  ranks <- smaa.ranks(utils)

  ra <- smaa.ra(ranks)
  cw <- smaa.cw(ranks, weights)
  cf <- smaa.cf(meas, cw)

  weights.quantiles <- apply(weights, 2, quantile, probs = c(0.025, 0.5, 0.975))
  weights.quantiles[2,] <- colMeans(weights)

  list(ra = ra, cw = cw, cf = cf, weights.quantiles = weights.quantiles)
}

formatSmaaResults <- function(smaa.results, alts.names) {
  cw <- lapply(alts.names, function(alt) {
    list(cf = unname(smaa.results$cf$cf[alt]), w = smaa.results$cf$cw[alt,])
  })
  names(cw) <- alts.names

  results <- list(
      "cw" = cw,
      "ranks" = wrap.matrix(smaa.results$ra),
      "weightsQuantiles" = wrap.matrix(smaa.results$weights.quantiles))
  descriptions <- list("Central weights", "Rank acceptabilities", "Quantiles of the sampled weights")
  applyWrapResult(results, descriptions)
}

run_smaa <- function(params) {
  smaa.results <- getSmaaResults(params)
  formatSmaaResults(smaa.results, names(params$alternatives))
}
