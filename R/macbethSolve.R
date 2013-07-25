run_macbeth <- function(params) {
  print(params)
  pref <- t(sapply(params[['preferences']], rbind))
  pref[sapply(pref, is.null)] <- NA
  pref <- matrix(as.numeric(pref), nrow=nrow(pref), ncol=ncol(pref))
  sol <- macbethSolve(pref, pref)
  sol / max(sol)
}

macbethSolve <- function(min.p, max.p) {
  # Evaluation of each reference alternative x_p, x_r (n: one for each row)
  # For each level of relative attractiveness, s_i, s_j (Q: one for each level, except 0)
  # A auxiliary variable d_min
  # So there are n + Q + 1 variables
  n <- nrow(max.p)
  Q <- max(max.p, na.rm=TRUE)
  nvar <- n + Q + 1

  # Equality constraints:
  # 1. if preference level 0, x_p = x_r:
  I <- which(upper.tri(max.p) & max.p == 0, arr.ind=TRUE)
  eq.con <- if (nrow(I)) {
    t(apply(I, 1, function(pair) {
      p <- pair[1]; r <- pair[2]
      con <- rep(0, nvar)
      con[p] <- 1
      con[r] <- -1
      con
    }))
  } else {
    matrix(nrow=0, ncol=nvar)
  }
  eq.rhs <- rep(0, nrow(I))

  # 2. dmin = 0.5
  dmin <- rep(0, nvar)
  dmin[nvar] <- 1
  eq.con <- rbind(eq.con, dmin)
  eq.rhs <- c(eq.rhs, 0.5)

  # 3. d_min - s_1 = 0
  s1 <- rep(0, nvar)
  s1[nvar] <- 1
  s1[n + 1] <- -1
  eq.con <- rbind(eq.con, s1)
  eq.rhs <- c(eq.rhs, 0)

  # Inequality constraints:
  # 1. For all 1 <= i <= j <= Q, if (a_p, a_r) \in C_i,j      --> s_i + d_min + x_r - x_p <= 0
  #     (a_p, a_r) \in C_i,j if max.p[p, r] == i, min.p[p, r] == j.
  ineq1 <- do.call(rbind, apply(which(upper.tri(diag(Q), diag=TRUE), arr.ind=TRUE), 1, function(pair) {
    i <- pair[1]; j <- pair[2]
    Cij <- which(upper.tri(max.p) & max.p == i & min.p == j, arr.ind=TRUE)
    if (nrow(Cij) > 0) {
      t(apply(Cij, 1, function(pair) {
        p <- pair[1]; r <- pair[2]
        con <- rep(0, nvar)
        con[p] <- -1
        con[r] <- 1
        con[n + i] <- 1
        con[nvar] <- 1
        con
      }))
    } else {
      matrix(ncol=nvar, nrow=0)
    }
  }))

  # 2. For all 1 <= i <= j <= Q - 1, if (a_p, a_r) \in C_i,j  --> x_p - x_r + d_min - s_j+1 <= 0
  #     (a_p, a_r) \in C_i,j if max.p[p, r] == i, min.p[p, r] == j.
  ineq2 <- do.call(rbind, apply(which(upper.tri(diag(Q - 1), diag=TRUE), arr.ind=TRUE), 1, function(pair) {
    i <- pair[1]; j <- pair[2]
    Cij <- which(upper.tri(max.p) & max.p == i & min.p == j, arr.ind=TRUE)
    if (nrow(Cij) > 0) {
      t(apply(Cij, 1, function(pair) {
        p <- pair[1]; r <- pair[2]
        con <- rep(0, nvar)
        con[p] <- 1
        con[r] <- -1
        con[n + j + 1] <- -1
        con[nvar] <- 1
        con
      }))
    } else {
      matrix(ncol=nvar, nrow=0)
    }
  }))

  # 3. For all 2 <= i <= Q, s_i-1 + 2d_min - s_i <= 0
  ineq3 <- t(sapply(2:Q, function(i) {
    con <- rep(0, nvar)
    con[n + i - 1] <- 1
    con[nvar] <- 2
    con[n + i] <- -1
    con
  }))

  # 4. For all 1 <= p <= n, -x_p <= 0
  ineq4 <- cbind(-diag(n), matrix(0, nrow=n, ncol=Q + 1))

  # 5. For all 1 <= i <= Q, -s_i <= 0
  ineq5 <- cbind(matrix(0, nrow=Q, ncol=n), -diag(Q), rep(0, Q))

  # Concatenate all inequality constraints
  iq.con <- rbind(ineq1, ineq2, ineq3, ineq4, ineq5)
  iq.rhs <- rep(0, nrow(iq.con))

  # Solve LP
  hrep <- makeH(iq.con, iq.rhs, eq.con, eq.rhs)
  obj <- rep(0, nvar)
  obj[1] <- 1
  sol <- lpcdd(hrep, obj, minimize=TRUE)

  if (sol$solution.type != "Optimal") {
    stop(sol)
  }

  sol$primal.solution[1:n]
}
