wrap.result <- function(result, description) {
    list(data=result, description=description, type=class(result))
}

wrap.matrix <- function(m) {
  l <- lapply(rownames(m), function(name) { m[name,] })
  names(l) <- rownames(m)
  l
}

smaa <- function(params) {
  allowed <- c('scales', 'smaa', 'macbeth')
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
  list(wrap.matrix(t(apply(meas, 3, function(e) { quantile(e, c(0.025, 0.975)) }))))
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
    stopifnot(N %% harBatches == 0)
    if (length(constr$rhs) > 0) {
      # Separate equality from inequality constraints
      sel.eq <- constr$dir == '='
      eq.constr <- list(constr = constr$constr[sel.eq, ],
                        rhs = constr$rhs[sel.eq],
                        dir = constr$dir[sel.eq])
      ineq.constr <- list(constr = constr$constr[!sel.eq, ],
                          rhs = constr$rhs[!sel.eq],
                          dir = constr$dir[!sel.eq])

      # Add the normalization contraint
      eq.constr <- mergeConstraints(eq.constr,
                                    list(constr = t(rep(1, n)), dir = '=', rhs = 1))

      # Generate basis, transform, seed point
      basis <- solution.basis(eq.constr)
      transform <- createTransform(basis)
      constr <- simplex.createConstraints(transform, ineq.constr)
      seedPoint <- createSeedPoint(constr, homogeneous=TRUE)
      if (length(seedPoint) == 1) {
        samples <- matrix(rep(basis$translate, each=N), nrow=N)
        update(harBatches * harBatchProgress)
        samples
      } else {
        # reduce number of required samples for small n by log approximation of
        # required scaling factor based on Fig. 3 of HAR paper.
        m <- length(seedPoint)
        thin <- ceiling(log(m)/4 * (m - 1)^3)
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
      }
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
