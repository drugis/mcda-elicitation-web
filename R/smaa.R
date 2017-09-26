wrap.result <- function(result, description) {
    list(data=result, description=description, type=class(result))
}

wrap.matrix <- function(m) {
  l <- lapply(rownames(m), function(name) { m[name,] })
  names(l) <- rownames(m)
  l
}

smaa_v2 <- function(params) {
  allowed <- c('scales','smaa','deterministic','sensitivityMeasurements','sensitivityMeasurementsPlot','sensitivityWeightPlot')
  if(params$method %in% allowed) {
    do.call(paste("run", params$method, sep="_"), list(params))
  } else {
    stop("method not allowed")
  }
}

run_scales <- function(params) {
  N <- 1000
  crit <- names(params$criteria)
  alts <- names(params$alternatives)
  meas <- sample(alts, crit, params$performanceTable, N)
  scales <- apply(meas, c(2, 3), function(e) { quantile(e, c(0.025, 0.5, 0.975)) })
  apply(aperm(scales, c(3,2,1)), 1, wrap.matrix)
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

genRepresentativeWeights <- function(params) {
  N <- 1E4
  crit <- names(params$criteria)
  n <- length(crit)
  
  constr <- mergeConstraints(lapply(params$preferences,genHARconstraint,crit=crit))
  constr <- mergeConstraints(simplexConstraints(n),constr)
  
  samples <- hitandrun(constr, n.samples=N)
  rep.weights <- colMeans(samples)
  names(rep.weights) <- crit
  
  rep.weights
  
}

genMedianMeasurements <- function(params) {
  N <- 1E4
  crit <- names(params$criteria)
  alts <- names(params$alternatives)
  meas <- sample(alts, crit, params$performanceTable, N)
  apply(meas, c(2, 3), median)
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
    meas[entry$alternative,entry$criterion] <- entry$value # Replace median value by the desired value for the sensitivity analysis
  }
  
  weights <- genRepresentativeWeights(params)
  
  valueProfiles <- calculateTotalValue(params,meas,weights)
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
  
  weight.crit <- seq(0,1,length.out=11)
  
  total.value <- c()
  for (value in weight.crit) {
    
    n <- length(weights)
    lhs <- rep(0,n)
    lhs[which(names(weights)==crit)] <- 1
    constr <- list(constr=lhs,dir="=",rhs=value)
    constr <- mergeConstraints(constr,simplexConstraints(n)) 
    
    for (i in names(params$criteria)) { # Keep the ratio between the other criteria weights fixed
      for (j in names(params$criteria)) {
        if (j>i & i!=crit & j!=crit) {
          constr <- mergeConstraints(constr,exactRatioConstraint(n,which(names(weights)==i),which(names(weights)==j),weights[i]/weights[j]))
        }
      }
    }
    
    cur.weights <- as.numeric(hitandrun(constr,n.samples=1))
    names(cur.weights) <- names(params$criteria)
    
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

run_smaa <- function(params) {
  N <- 1E4
  n <- length(params$criteria)
  m <- length(params$alternatives)
  crit <- names(params$criteria)
  alts <- names(params$alternatives)

  update(0)

  harBatches <- 20
  harBatchProgress <- 4
  harSample <- function(constr, n, N) {
    stopifnot(N %% harBatches == 0)
    if (length(constr$rhs) > 0) {
      constr <- mergeConstraints(constr, simplexConstraints(n))
      state <- har.init(constr)
      samples <- matrix(0, nrow=N, ncol=n)
      Nb <- N/harBatches
      for(i in 1:harBatches) {
          out <- har.run(state, Nb)
          samples[(1 + Nb * (i - 1)):(Nb * i), ] <- out$samples
          state <- out$state
          update(i * harBatchProgress)
      }
      samples
    } else {
      samples <- simplex.sample(n, N)$samples
      update(harBatches * harBatchProgress)
      samples
    }
  }

  # parse preference information
  constr <- mergeConstraints(lapply(params$preferences,genHARconstraint,crit=crit))
  
  weights <- harSample(constr, n, N)
  colnames(weights) <- crit

  meas <- sample.partialValues(params, N)
  update(95)

  utils <- smaa.values(meas, weights)
  update(96)
  ranks <- smaa.ranks(utils)
  update(97)

  cw <- smaa.cw(ranks, weights)
  update(98)
  cf <- smaa.cf(meas, cw)
  update(100)

  cw <- lapply(alts, function(alt) {
    list(cf=unname(cf$cf[alt]), w=cf$cw[alt,])
  })
  names(cw) <- alts

  results <- list(
    results = list(
             "cw"=cw,
             "ranks"=wrap.matrix(smaa.ra(ranks))),
    descriptions = list("Central weights", "Rank acceptabilities")
  )

  mapply(wrap.result,
          results$results,
          results$descriptions,
          SIMPLIFY=F)
}
