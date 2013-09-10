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

sampler.exact <- function(perf, N) {
  rep(perf$value, lenght.out=N)
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
    smaa.pvf(x, y, v, outOfBounds="interpolate")
  }
}

ratioConstraint <- function(n, i1, i2, x) {
  a <- rep(0, n)
  a[i1] <- -1
  a[i2] <- x
  list(constr = t(a), rhs = c(0), dir = c("="))
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
  harSample <- function(constr, n , N) {
    if (length(constr$rhs) > 0) {
      stopifnot(N %% harBatches == 0)
      transform <- simplex.createTransform(n)
      constr <- simplex.createConstraints(transform, constr)
      seedPoint <- createSeedPoint(constr, homogeneous=TRUE)
      # reduce number of required samples for small n by log approximation of
      # required scaling factor based on Fig. 3 of HAR paper.
      thin <- ceiling(log(n)/4 * (n - 1)^3)
      xN <- seedPoint
      samples <- matrix(0, nrow=N, ncol=n)
      Nb <- N/harBatches
      for(i in 1:harBatches) {
        out <- har(xN, constr, N=Nb * thin, thin=thin, homogeneous=TRUE, transform=transform)
        samples[(1 + Nb * (i - 1)):(Nb * i), ] <- out$samples
        xN <- out$xN
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
      } else if (statement['type'] == "exact swing") {
        ratioConstraint(n, i1, i2, statement$ratio);
      }
    })
  )

  weights <- harSample(constr, n, N)
  colnames(weights) <- crit

  pvf <- lapply(params$criteria, create.pvf);
  meas <- sample(alts, crit, params$performanceTable, N)
  for (criterion in names(params$criteria)) {
    meas[,,criterion] <- pvf[[criterion]](meas[,,criterion])
  }
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
