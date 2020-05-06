# import getSelectedCriteria from util.R
# import genRepresentativeWeights from weights.R
# import createPvf from pvf.R

run_indifferenceCurve <- function(params) {
  criteria <- getSelectedCriteria(params$indifferenceCurve)
  getDifferenceWithReference <- getDifferenceWithReferenceFunction(params, criteria)
  cutOffs <- getCutoffs(params, criteria)
  ranges <- getRanges(params$criteria, criteria)
  coordinatesForCutoffs <- getCoordinatesForCutoffs(cutOffs, getDifferenceWithReference, ranges)
  return(calculateIndifferenceCurve(cutOffs, coordinatesForCutoffs, ranges))
}

getDifferenceWithReferenceFunction <- function(params, criteria) {
  weights <- genRepresentativeWeights(params)
  pvf <- lapply(params$criteria, createPvf)
  referencePoint <- c(params$indifferenceCurve$x, params$indifferenceCurve$y)
  indifferenceValue <- getIndifferenceValue(weights, criteria, pvf, referencePoint)
  getDifferenceWithReference <- function(x, y) {
    as.numeric(weights[criteria$x] * pvf[[criteria$x]](x) + weights[criteria$y] * pvf[[criteria$y]](y) - indifferenceValue)
  }
  return(getDifferenceWithReference)
}

getIndifferenceValue <- function(weights, criteria, pvfsByCriterion, referencePoint) {
  xWeight <- weights[criteria$x] * pvfsByCriterion[[criteria$x]](referencePoint[1])
  yWeight <- weights[criteria$y] * pvfsByCriterion[[criteria$y]](referencePoint[2])
  indifferenceValue <- as.numeric(xWeight + yWeight)
  return(indifferenceValue)
}

getCutoffs <- function(params, criteria) {
  cutoffs <- list(
    "x" = getCutoffsForPvf(params$criteria[[criteria$x]]$pvf),
    "y" = getCutoffsForPvf(params$criteria[[criteria$y]]$pvf)
  )
  return(cutoffs)
}

getCutoffsForPvf <- function(pvf) {
  cutoffs <- pvf$range
  if (pvf$type != "linear") {
    cutoffs <- c(cutoffs, pvf$cutoffs)
  }
  return(cutoffs)
}

getRanges <- function(criteria, selectedCriteria) {
  ranges <- list(
    "x" = criteria[[selectedCriteria$x]]$pvf$range,
    "y" = criteria[[selectedCriteria$y]]$pvf$range
  )
  return(ranges)
}

getCoordinatesForCutoffs <- function(cutOffs, getDifferenceWithReference, ranges) {
  coordinatesForCutoffs <- list(
    "xForY" = getXCoordinateForYCutOff(cutOffs$y, getDifferenceWithReference, ranges$y),
    "yForX" = getYCoordinateForXCutoff(cutOffs$x, getDifferenceWithReference, ranges$y)
  )
  return(coordinatesForCutoffs)
}

getYCoordinateForXCutoff <- function(xCutOffs, getDifferenceWithReference, yRange) {
  yCoordinateForXCutoff <- c()
  for (x in xCutOffs) {
    yCoordinateForXCutoff <- c(yCoordinateForXCutoff, uniroot(f = getDifferenceWithReference, interval = yRange, x = x, extendInt = "yes")$root)
  }
  return(yCoordinateForXCutoff)
}

getXCoordinateForYCutOff <- function(yCutOffs, getDifferenceWithReference, yRange) {
  xCoordinateForYCutoff <- c()
  for (y in yCutOffs) {
    xCoordinateForYCutoff <- c(xCoordinateForYCutoff, uniroot(f = getDifferenceWithReference, interval = yRange, y = y, extendInt = "yes")$root)
  }
  return(xCoordinateForYCutoff)
}

calculateIndifferenceCurve <- function(cutOffs, coordinatesForCutoffs, ranges) {
  coordinates <- data.frame(
    "x" = c(cutOffs$x, coordinatesForCutoffs$xForY),
    "y" = c(coordinatesForCutoffs$yForX, cutOffs$y)
  )
  coordinates <- coordinates[order(coordinates$x),]
  coordinates <- removeCoordinatesOutsideOfRange(coordinates, coordinates$x, ranges$x)
  coordinates <- removeCoordinatesOutsideOfRange(coordinates, coordinates$y, ranges$y)
  return(coordinates)
}

removeCoordinatesOutsideOfRange <- function(coordinates, values, range) {
  epsilon <- 0.001 * (range[2] - range[1]);
  coordinates <- coordinates[values + epsilon >= range[1] & values - epsilon <= range[2],]
  return(coordinates)
}
