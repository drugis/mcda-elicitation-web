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
  allowed <- c('scales', 'smaa')
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

  partialValue <- function(worst, best) {
    if (best > worst) {
      function(x) {
        (x - worst) / (best - worst)
      }
    } else {
      function(x) {
        (worst - x) / (worst - best)
      }
    }
  }

  pvf <- lapply(params$criteria, function(criterion) {
    range <- criterion$pvf$range
    if (criterion$pvf$direction == 'increasing') {
      return(partialValue(range[1], range[2]))
    } else if (criterion$pvf$direction == 'decreasing') {
      return(partialValue(range[2], range[1]))
    } else {
      stop(paste("PVF type '", criterion$pvf$type, "' not supported.", sep=''))
    }
  })

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
