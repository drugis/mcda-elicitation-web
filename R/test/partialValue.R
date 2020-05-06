library('RJSONIO')

pvf1 <- createPvf(list(pvf=list(type="linear", direction="increasing", range=c(-0.15, 0.35))))
pvf2 <- createPvf(list(pvf=list(type="linear", direction="decreasing", range=c(50, 100))))

stopifnot(all.equal(pvf1(0.35), 1))
stopifnot(all.equal(pvf1(-0.15), 0))
stopifnot(all.equal(pvf1(0.1), 0.5))
stopifnot(all.equal(pvf1(c(0.35, 0.1)), c(1, 0.5)))

stopifnot(all.equal(pvf2(50), 1))
stopifnot(all.equal(pvf2(100), 0))
stopifnot(all.equal(pvf2(75), 0.5))
stopifnot(all.equal(pvf2(c(75, 100)), c(0.5, 0)))

crit1 <- list(type="piecewise-linear",
              direction="increasing",
              range=c(-0.15, 0.35),
              cutoffs=c(0.0, 0.25),
              values=c(0.1, 0.9))

crit2 <- list(type="piecewise-linear",
              direction="decreasing",
              range=c(50, 100),
              cutoffs=c(75, 90),
              values=c(0.8, 0.5))

pvf3 <- createPvf(list(pvf=crit1))
pvf4 <- createPvf(list(pvf=crit2))

stopifnot(all.equal(pvf3(0.35), 1.0))
stopifnot(all.equal(pvf3(-0.15), 0.0))
stopifnot(all.equal(pvf3(0.0), 0.1))
stopifnot(all.equal(pvf3(0.25), 0.9))
stopifnot(all.equal(pvf3(0.1), 2/5*0.8+0.1))

stopifnot(all.equal(pvf4(50), 1.0))
stopifnot(all.equal(pvf4(60), 1-(2/5*0.2)))
stopifnot(all.equal(pvf4(75), 0.8))
stopifnot(all.equal(pvf4(90), 0.5))
stopifnot(all.equal(pvf4(100), 0.0))
stopifnot(all.equal(pvf4(c(50,90,100)), c(1.0, 0.5, 0.0)))

