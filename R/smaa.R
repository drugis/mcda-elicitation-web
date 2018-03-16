wrap.result <- function(result, description) {
    list(data=result, description=description, type=class(result))
}

wrap.matrix <- function(m) {
  l <- lapply(rownames(m), function(name) { m[name,] })
  names(l) <- rownames(m)
  l
}

smaa_v2 <- function(params) {
  allowed <- c('scales','smaa','deterministic','sensitivityMeasurements','sensitivityMeasurementsPlot','sensitivityWeightPlot','weightBounds','indifferenceCurves')
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

# Generate equality constraints for exact weights 
ExactWeightConstraints <- function(params) {
  
  crit <- names(params$criteria)
  n <- length(crit)
  m <- length(params$deterministicWeights)
  
  A <- diag(n)
  row.names(A) <- crit
  
  constr <- NULL
  for (i in 1:m) {
    cur.constr <- list(constr=A[params$deterministicWeights[[i]]$criterion,],rhs=params$deterministicWeights[[i]]$weight,dir="=")
    constr <- mergeConstraints(constr,cur.constr)
  }
  
  constr
  
}

# Make H-representation of the convex polygedron
generateHrep <- function(constr) {
  n.contr <- dim(constr$constr)[1]
  
  a1 <- c()
  b1 <- c()
  a2 <- c()
  b2 <- c()
  for (i in 1:n.contr) {
    if (constr$dir[i]=="<=") {
      a1 <- rbind(a1,constr$constr[i,])
      b1 <- c(b1,constr$rhs[i])
    }
    if (constr$dir[i]=="=") {
      a2 <- rbind(a2,constr$constr[i,])
      b2 <- c(b2,constr$rhs[i])
    }
  }
  
  rcdd::makeH(a1,b1,a2,b2)
  
}

# Determine criterion-wise lower and upper bounds for the weights
run_weightBounds <- function(params) {
  
  crit <- names(params$criteria)
  n <- length(crit)
  
  constr <- mergeConstraints(lapply(params$preferences,genHARconstraint,crit=crit))
  constr <- mergeConstraints(simplexConstraints(n),constr)
  
  A <- diag(n)
  row.names(A) <- crit
  
  H <- generateHrep(constr)
  
  if (!is.null(params$deterministicWeights)) {
    m <- length(params$deterministicWeights)
    for (i in 1:m) {
      a <- A[params$deterministicWeights[[i]]$criterion,]
      b <- params$deterministicWeights[[i]]$weight
      H <- rcdd::addHeq(a,b,H)
    }
  }
  
  lower <- c()
  upper <- c()
  for (i in 1:n) {
    lower <- c(lower,rcdd::lpcdd(H,A[i,],minimize=T)$optimal.value)
    upper <- c(upper,rcdd::lpcdd(H,A[i,],minimize=F)$optimal.value)
  }
  
  names(lower) <- crit
  names(upper) <- crit
  
  list(lower=lower,upper=upper)
  
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
  
  if (!is.null(params$deterministicWeights)) {
    
    exact.constr <- ExactWeightConstraints(params)
    constr <- mergeConstraints(constr,exact.constr)
    
    # Substract the fixed weights from the add up to 1 contraint
    constr$constr[1,] <- constr$constr[1,] - colSums(exact.constr$constr)
    constr$rhs[1] <- constr$rhs[1] - sum(exact.constr$rhs)
    
  }
  
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

# Calculate the trade-offs between two criteria
run_indifferenceCurves <- function(params) {
  
  crit.x <- params$IndifferenceCurves$crit.x
  crit.y <- params$IndifferenceCurves$crit.y
  
  range.x <- params$criteria[[crit.x]]$pvf$range
  shape.x <- params$criteria[[crit.x]]$pvf$type
    
  range.y <- params$criteria[[crit.y]]$pvf$range
  shape.y <- params$criteria[[crit.y]]$pvf$type
  
  meas <- genMedianMeasurements(params) 
  
  weights <- genRepresentativeWeights(params)
  pvf <- lapply(params$criteria, create.pvf)
  
  value <- function(x,y) {
    as.numeric(weights[crit.x]*pvf[[crit.x]](x) + weights[crit.y]*pvf[[crit.y]](y))
  }
  
  grid.x <- seq(range.x[1],range.x[2],length.out=20)
  grid.y <- seq(range.y[1],range.y[2],length.out=20)
  z <- matrix(data=NA,nrow=length(grid.x),ncol=length(grid.y))
  for (i in 1:length(grid.x)) {
    for (j in 1:length(grid.y)) {
      z[i,j] <- value(grid.x[i],grid.y[j])
    }
  }
  
  
  values.alt <- mapply(value,meas[,crit.x],meas[,crit.y]) # Contour levels of the alternatives
  
  #breaks <- sort(c(range(z),values.alt))
  # levels <- c()
  # for (i in 1:(length(breaks)-1)) {
  #   levels <- c(levels,seq(breaks[i],breaks[i+1],length.out=round((breaks[i+1]-breaks[i])/(sum(range(z))/15))))
  # }
  # levels <- unique(levels)
  
  levels <- values.alt
  #levels <- pretty(range(z, na.rm = TRUE), 10)
  
  curves <- contourLines(x=grid.x,y=grid.y,z=z,levels=levels)
  
  n <- length(curves)
  data.plot <- c()
  for (i in 1:length(curves)) {
    if (shape.x=="linear" & shape.y=="linear") {
      data.plot <-rbind(data.plot,cbind(curves[[i]]$x[c(1,length(curves[[i]]$x))],curves[[i]]$y[c(1,length(curves[[i]]$y))],rep(curves[[i]]$level,2)))
    } else {
      data.plot <-rbind(data.plot,cbind(curves[[i]]$x,curves[[i]]$y,rep(curves[[i]]$level,length(curves[[i]]$x))))
    }
  }
  data.plot <- as.data.frame(data.plot)
  names(data.plot) <- c("x","y","value")
  
  data.plot

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
