library(smaa)
library(hitandrun)
library(mnormt)

wrap.result <- function(result, description) {
    list(data=result, description=description, type=class(result))
}
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

smaa <- function(params) {
  N <- 10000
  n <- length(params$criteria)
  m <- length(params$alternatives)
  crit <- names(params$criteria)
  alts <- names(params$alternatives)

  pvf <- lapply(params$criteria, function(criterion) {
    range <- criterion$pvf$range
    if (criterion$pvf$type == 'linear-increasing') {
      return(partialValue(range[1], range[2]))
    } else if (criterion$pvf$type == 'linear-decreasing') {
      return(partialValue(range[2], range[1]))
    } else {
      stop(paste("PVF type '", criterion$pvf$type, "' not supported.", sep=''))
    }
  })

  ilogit <- function(x) {
    1 / (1 + exp(-x))
  }

  meas <- array(dim=c(N,m,n), dimnames=list(NULL, alts, crit))
  for (m in params$performanceTable) {
    if (m$performance$type == 'dbeta') {
      meas[, m$alternative, m$criterion] <- pvf[[m$criterion]](rbeta(N, m$performance$parameters['alpha'], m$performance$parameters['beta']))
    } else if (m$performance$type == 'relative-logit-normal') {
      perf <- m$performance$parameters
      baseline <- perf$baseline
      sampleBase <- function() {
        if (baseline$type == 'dnorm') {
          rnorm(N, baseline$mu, baseline$sigma)
        } else {
          stop(paste("Distribution '", baseline$type, "' not supported", sep=''))
        }
      }
      sampleDeriv <- function(base) {
        if(perf$relative$type == 'dmnorm') {
          varcov <- perf$relative$cov
          covariance <- matrix(unlist(varcov$data),
                                  nrow=length(varcov$rownames),
                                  ncol=length(varcov$colnames))
          rownames(covariance) <- varcov$rownames
          colnames(covariance) <- varcov$colnames
          baserow <- which(rownames(covariance) == baseline$name)
          basecol <- which(colnames(covariance) == baseline$name)
          covariance <- covariance[-baserow, -basecol]
          mean <- perf$relative$mu[-which(names(perf$relative$mu) == baseline$name)]
          samples <- rmnorm(N, mean=base + mean, varcov=covariance)
          samples <- cbind(base, samples)
        } else {
          stop(paste("Distribution '", perf$relative$type, "' not supported", sep=''))
        }
      }
      base <- sampleBase()
      deriv <- sampleDeriv(base)
      samples <- pvf[[m$criterion]](ilogit(deriv))
      meas[, ,m$criterion] <- samples
    } else {
      stop(paste("Performance type '", m$performance$type, "' not supported.", sep=''))
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
      }
    })
  )

  weights <- harSample(constr, n, N)

  utils <- smaa.values(meas, weights)
  ranks <- smaa.ranks(utils)

  wrap.matrix <- function(m) {
      l <- lapply(rownames(m), function(name) { m[name,] })
      names(l) <- rownames(m)
      l
  }
  results <- list(
    results = list("parameters"=params,
             "ranks"=wrap.matrix(smaa.ra(ranks))),
    descriptions = list("Parameters", "Rank acceptabilities")
  )

  mapply(wrap.result,
          results$results,
          results$descriptions,
          SIMPLIFY=F)
}
