# Required packages: hitandrun
library(hitandrun)

wrap.result <- function(result, description) {
    list(data=result, description=description, type=class(result))
}

wrap.matrix <- function(m) {
  l <- lapply(rownames(m), function(name) { m[name,] })
  names(l) <- rownames(m)
  l
}

run_scales <- function(params) {
  apply(generateSummaryStatistics(params),1,wrap.matrix)
}

ratioConstraint <- function(n, i1, i2, x) {
  a <- rep(0, n)
  a[i1] <- -1
  a[i2] <- x
  list(constr = t(a), rhs = c(0), dir = c("="))
}

run_deterministic <- function(params) {
  meas <- genMedianMeasurements(params) 
  weights <- genRepresentativeWeights(params)
  valueProfiles <- calculateTotalValue(params,meas,weights)
  totalValue <- rowSums(valueProfiles)
  
  results <- list(
    results = list(
      "weights"=weights,
      "value"=wrap.matrix(valueProfiles),
      "total"=totalValue),
    descriptions = list("Representative weights", "Value profile", "Total value")
  )
  
  mapply(wrap.result,
         results$results,
         results$descriptions,
         SIMPLIFY=F)
}


run_representativeWeights <- function(params) {
  list(data=genRepresentativeWeights(params), description="Representative weights")
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
  t(generateSummaryStatistics(params)[,,"50%"])
}

genHARconstraint <- function(statement,crit) {
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
calculateTotalValue <- function(params,meas,weights) {
  pvf <- lapply(params$criteria, create.pvf)
  for (criterion in names(params$criteria)) {
    meas[,criterion] <- pvf[[criterion]](meas[,criterion]) * weights[criterion]
  }
  meas
}

run_sensitivityMeasurements <- function(params) {
  
  meas <- genMedianMeasurements(params)
  for (entry in params$sensitivityAnalysis$meas) {
    # Replace median value by the desired value for the sensitivity analysis
    meas[entry$alternative,entry$criterion] <- entry$value 
  }
  
  weights <- genRepresentativeWeights(params)
  
  valueProfiles <- calculateTotalValue(params, meas, weights)
  totalValue <- rowSums(valueProfiles)
  
  results <- list(
    results = list(
      "value"=wrap.matrix(valueProfiles),
      "total"=totalValue),
    descriptions = list("Value profile", "Total value")
  )
  
  mapply(wrap.result,
         results$results,
         results$descriptions,
         SIMPLIFY=F)
}

run_sensitivityMeasurementsPlot <- function(params) {
  
  weights <- genRepresentativeWeights(params)
  
  meas <- genMedianMeasurements(params)
  alt <- params$sensitivityAnalysis["alternative"]
  crit <- params$sensitivityAnalysis["criterion"]
  
  range <- params$criteria[[crit]]$pvf$range
  if (params$criteria[[crit]]$pvf$type=='linear') {
    xCoordinates <- range
  } else {
    xCoordinates <- c(range[1],params$criteria[[crit]]$pvf$cutoffs,range[2])
  }
  
  
  total.value <- c()
  for (value in xCoordinates) {
    cur.meas <- meas
    cur.meas[alt,crit] <- value
    total.value <- cbind(total.value,rowSums(calculateTotalValue(params,cur.meas,weights)))
  }
  
  colnames(total.value) <- xCoordinates
  
  results <- list(
    results = list(
      "alt"=alt,
      "crit"=crit,
      "total"=wrap.matrix(total.value)),
    descriptions = list("Alternative","Criterion","Total value")
  )
  
  mapply(wrap.result,
         results$results,
         results$descriptions,
         SIMPLIFY=F)
  
}

run_sensitivityWeightPlot <- function(params) {
  
  crit <- params$sensitivityAnalysis["criterion"]
  
  meas <- genMedianMeasurements(params)
  weights <- genRepresentativeWeights(params)
  
  index <- which(names(weights)==crit)
  
  weight.crit <- seq(0,1,length.out=11)
  total.value <- c()
  
  for (value in weight.crit) {
 
    adjust <- (1-value)/sum(weights[-index])
    cur.weights <- adjust*weights
    cur.weights[index] <- value
    
    valueProfiles <- calculateTotalValue(params,meas,cur.weights)
    total.value <- cbind(total.value,rowSums(valueProfiles))
    
  }
  
  colnames(total.value) <- weight.crit
  
  results <- list(
    results = list(
      "crit"=crit,
      "total"=wrap.matrix(total.value)),
    descriptions = list("Criterion","Total value")
  )
  
  mapply(wrap.result,
         results$results,
         results$descriptions,
         SIMPLIFY=F)
  
} 

getCutoffs <- function(params,crit) {
  
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
    type='exact swing',
    ratio=weight,
    criteria=c(criterionX, criterionY))
  )
  
  result <- run_indifferenceCurve(params)
  result$weight <- weight
  result
}

run_indifferenceCurve <- function(params) {
  
  criterionX <- params$indifferenceCurve$criterionX
  criterionY <- params$indifferenceCurve$criterionY
  ref.point  <- c(params$indifferenceCurve$x, params$indifferenceCurve$y)
  
  # Value function
  weights <- genRepresentativeWeights(params)
  pvf <- lapply(params$criteria, create.pvf)
  
  # Value associated with the reference point
  xWeight <- weights[criterionX] * pvf[[criterionX]](ref.point[1])
  yWeight <- weights[criterionY] * pvf[[criterionY]](ref.point[2])
  Indifference.value <- as.numeric(xWeight + yWeight)
  
  # Difference in value between the reference point and the point (x,y)
  value.difference <- function(x,y) {
    as.numeric(weights[criterionX] * pvf[[criterionX]](x) + weights[criterionY] * pvf[[criterionY]](y) - Indifference.value)
  }
  
  cutoffs1 <- getCutoffs(params, criterionX)
  cutoffs2 <- getCutoffs(params, criterionY)
  
  range1 <- params$criteria[[criterionX]]$pvf$range
  range2 <- params$criteria[[criterionY]]$pvf$range
  
  # Determine y coordinates of the indifference curve at the x coordinates in cutoffs1
  cutoffs1_y <- c()
  for (x in cutoffs1) {
    cutoffs1_y <- c(cutoffs1_y, uniroot(f=value.difference, interval=range2, x=x, extendInt="yes")$root)
  }
  
  # Determine x coordinates of the indifference curve at the y coordinates in cutoffs2
  cutoffs2_x <- c()
  for (y in cutoffs2) {
    cutoffs2_x <- c(cutoffs2_x, uniroot(f=value.difference, interval=range2, y=y, extendInt="yes")$root)
  }
  
  coordinates <- data.frame(x = c(cutoffs1, cutoffs2_x), y = c(cutoffs1_y, cutoffs2))
  coordinates <- coordinates[order(coordinates$x), ]

  epsilonX <- 0.001 * (range1[2] - range1[1]);
  epsilonY <- 0.001 * (range2[2] - range2[1]);
  coordinates <- coordinates[coordinates$x + epsilonX >= range1[1] & coordinates$x - epsilonX <= range1[2], ] # Remove coordinates outside the scale range of criterionX
  coordinates <- coordinates[coordinates$y + epsilonY >= range2[1] & coordinates$y - epsilonY <= range2[2], ] # Remove coordinates outside the scale range of criterionY
  rownames(coordinates) <- NULL
  wrap.result(coordinates, 'IndifferenceCoordinates')  
}

sampleWeights <- function(preferences, crit, n, N) {
  constr <- mergeConstraints(lapply(preferences,genHARconstraint,crit=crit))
  constr <- mergeConstraints(simplexConstraints(n),constr)
  weights <- hitandrun(constr, n.samples=N)
  colnames(weights) <- crit
  weights
}

getSmaaWeights <- function(params, crit, n, N) {
  weights <- sampleWeights(params$preferences, crit, n, N)
  if(!is.null(params$uncertaintyOptions)) {
    if (!params$uncertaintyOptions["weights"]) {
      mean.weights <- colMeans(weights) 
      for (i in 1:N) {
        weights[i, ] <- mean.weights
      }
    }
  }
  return(weights)
}

getSmaaMeasurements <- function(params, N, crit) {
  meas <- sample.partialValues(params, N)
  if(!is.null(params$uncertaintyOptions)) {
    if (!params$uncertaintyOptions["measurements"]) {
      median.meas <- genMedianMeasurements(params) 
      pvf <- lapply(params$criteria, create.pvf)
      for (criterion in crit) {
        median.meas[,criterion] <- pvf[[criterion]](median.meas[,criterion])
      }
      for (i in 1:N) {
        meas[i, , ] <- median.meas
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
  
  weights.quantiles <- apply(weights, 2, quantile, probs=c(0.025, 0.5, 0.975))
  
  list(ra=ra, cw=cw, cf=cf, weights.quantiles=weights.quantiles)
}

formatSmaaResults <- function(smaa.results, alts.names) {
  cw <- lapply(alts.names, function(alt) {
    list(cf=unname(smaa.results$cf$cf[alt]), w=smaa.results$cf$cw[alt,])
  })
  names(cw) <- alts.names
  
  results <- list(
    results = list(
      "cw"=cw,
      "ranks"=wrap.matrix(smaa.results$ra),
      "weightsQuantiles"=wrap.matrix(smaa.results$weights.quantiles)),
    descriptions = list("Central weights", "Rank acceptabilities", "Quantiles of the sampled weights")
  )
  
  mapply(wrap.result,
         results$results,
         results$descriptions,
         SIMPLIFY=F)
}

run_smaa <- function(params) {
  smaa.results <- getSmaaResults(params)
  formatSmaaResults(smaa.results,  names(params$alternatives))
}
