wrap.result <- function(result, description) {
    list(data=result, description=description, type=class(result))
}

wrap.matrix <- function(m) {
  l <- lapply(rownames(m), function(name) { m[name,] })
  names(l) <- rownames(m)
  l
}

ilogit <- function(x) {
  1 / (1 + exp(-x))
}

smaa <- function(params) {
  allowed <- c('scales', 'smaa', 'macbeth')
  if(params$method %in% allowed) {
    do.call(paste("run", params$method, sep="_"), list(params))
  } else {
    stop("method not allowed")
  }
}

assign.sample <- function(defn, samples) {
  N <- dim(samples)[1]
  if (!is.null(defn$alternative)) {
    samples[, defn$alternative, defn$criterion] <- sampler(defn$performance, N)
  } else {
    samples[, , defn$criterion] <- sampler(defn$performance, N)
  }
  samples
}

sampler <- function(perf, N) {
  fn <- paste('sampler', gsub('-', '_', perf[['type']]), sep='.')
  do.call(fn, list(perf, N))
}

sampler.dbeta <- function(perf, N) {
  rbeta(N, perf$parameters['alpha'], perf$parameters['beta'])
}

sampler.dnorm <- function(perf, N) {
  rnorm(N, perf$parameters['mu'], perf$parameters['sigma'])
}

sampler.relative_normal <- function(perf, N) {
  baseline <- perf$parameters$baseline
  relative <- perf$parameters$relative

  baseline$parameters <- unlist(baseline[sapply(baseline, is.numeric)])
  base <- sampler(baseline, N)

  sampleDeriv <- function(base) {
    if(relative$type == 'dmnorm') {
      varcov <- relative$cov
      covariance <- matrix(unlist(varcov$data),
                            nrow=length(varcov$rownames),
                            ncol=length(varcov$colnames))
      mvrnorm(N, relative$mu, covariance) + base
    }
  }
  sampleDeriv(base)
}

sampler.relative_logit_normal <- function(perf, N) {
  ilogit(sampler.relative_normal(perf, N))
}

sample <- function(alts, crit, performanceTable, N) {
  meas <- array(dim=c(N,length(alts), length(crit)), dimnames=list(NULL, alts, crit))
  for (measurement in performanceTable) {
    meas <- assign.sample(measurement, meas)
  }
  meas
}

run_scales <- function(params) {
  N <- 1000
  crit <- names(params$criteria)
  alts <- names(params$alternatives)
  meas <- sample(alts, crit, params$performanceTable, N)
  list(wrap.matrix(t(apply(meas, 3, function(e) { quantile(e, c(0.025, 0.975)) }))))
}

create.pvf <- function(criterion) {
  pvf <- criterion$pvf
  if (pvf$direction == 'increasing') {
    worst <- pvf$range[1]
    best <- pvf$range[2]
  } else if (pvf$direction == 'decreasing') {
    worst <- pvf$range[2]
    best <- pvf$range[1]
  } else {
    stop(paste("Invalid PVF direction '", pvf$direction, "'", sep=""))
  }

  if (pvf$type == 'piecewise-linear') {
    return(partialValue(best, worst, pvf$cutoffs, pvf$values))
  } else if (pvf$type == 'linear') {
    return(partialValue(best, worst))
  } else {
    stop(paste("Invalid PVF type '", pvf$type, "'", sep=""))
  }
}


partialValue <- function(best, worst, cutoffs=numeric(), values=numeric()) {
  if (best > worst) {
    # Increasing
    v <- c(0, values, 1)
    y <- c(worst, cutoffs, best)
  } else {
    # Decreasing
    v <- c(1, values, 0)
    y <- c(best, cutoffs, worst)
  }
  function(x) {
    i <- sapply(x, function(x) { which(y >= x)[1] })
    i[is.na(i) | i == 1] <- 2
    v[i - 1] + (x - y[i - 1]) * ((v[i] - v[i - 1]) / (y[i] - y[i - 1]))
  }
}

run_smaa <- function(params) {
  N <- 1E4
  n <- length(params$criteria)
  m <- length(params$alternatives)
  crit <- names(params$criteria)
  alts <- names(params$alternatives)

  harSample <- function(constr, n , N) {
    transform <- simplex.createTransform(n)
    constr <- simplex.createConstraints(transform, constr)
    seedPoint <- createSeedPoint(constr, homogeneous=TRUE)
    har(seedPoint, constr, N=N * (n-1)^3, thin=(n-1)^3, homogeneous=TRUE, transform=transform)$samples
  }

  pvf <- lapply(params$criteria, create.pvf);
  meas <- sample(alts, crit, params$performanceTable, N)
  for (criterion in names(params$criteria)) {
    meas[,,criterion] <- pvf[[criterion]](meas[,,criterion])
  }

  # parse preference information
  constr <- do.call(mergeConstraints, lapply(params$preferences,
    function(statement) {
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
      }
    })
  )

  weights <- harSample(constr, n, N)
  colnames(weights) <- crit

  utils <- smaa.values(meas, weights)
  ranks <- smaa.ranks(utils)

  cw <- smaa.cw(ranks, weights)
  cf <- smaa.cf(meas, cw)

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
