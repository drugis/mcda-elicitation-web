library(RJSONIO)
library(smaa)
library(hitandrun)

update <- function(i) {}

source('../measurements.R')
source('../smaa.R')

params <- fromJSON('../../examples/thrombolytics.json')

print("=== CI hulls ===")

expected <- structure(list(
  `Prox DVT` = structure(c(0.0273829683645853, 0.211008623949751), .Names = c("2.5%", "97.5%")),
  `Dist DVT` = structure(c(0.179207896860712, 0.372992144610352), .Names = c("2.5%", "97.5%")),
  Bleed = structure(c(0.000174242898524121, 0.0774123400973682), .Names = c("2.5%", "97.5%"))),
  .Names = c("Prox DVT", "Dist DVT", "Bleed"))

scales <- run_scales(params)
actual <- lapply(scales, function(y) {
  lower <- min(unlist(lapply(y, function(z) { z["2.5%"] })))
  upper <- max(unlist(lapply(y, function(z) { z["97.5%"] })))
  c("2.5%"=lower, "97.5%"=upper)
})
print(all.equal(expected, actual, tolerance=0.05))

print("=== Preference Free ===")

expected <-
  structure(list(cw = structure(list(data = structure(list(Hep = structure(list(
    cf = 0.6389, w = structure(c(0.197599538560203, 0.278041542207046, 
    0.524358919232751), .Names = c("Prox DVT", "Dist DVT", "Bleed"
    ))), .Names = c("cf", "w")), Enox = structure(list(cf = 0.8925, 
    w = structure(c(0.411818897723962, 0.357824528300451, 0.230356573975587
    ), .Names = c("Prox DVT", "Dist DVT", "Bleed"))), .Names = c("cf", 
"w"))), .Names = c("Hep", "Enox")), description = "Central weights", 
    type = "list"), .Names = c("data", "description", "type")), 
    ranks = structure(list(data = structure(list(Hep = c(0.3381, 
    0.6619), Enox = c(0.6619, 0.3381)), .Names = c("Hep", "Enox"
    )), description = "Rank acceptabilities", type = "list"), .Names = c("data", 
    "description", "type"))), .Names = c("cw", "ranks"))

actual <- run_smaa(params)
print(all.equal(expected$ranks, actual$ranks, tolerance=0.02))
print(all.equal(expected$cw, actual$cw, tolerance=0.05)) 

### Interval SWING
print("=== Interval SWING ===")

params$preferences <- list(
  list(criteria=c('Prox DVT', 'Bleed'),
       type='ordinal'),
  list(criteria=c('Bleed', 'Dist DVT'),
       type='ordinal'))

expected <- 
  structure(list(cw = structure(list(data = structure(list(Hep = structure(list(
    cf = 0.1914, w = structure(c(0.52397265721202, 0.121295521278019, 
    0.354731821509961), .Names = c("Prox DVT", "Dist DVT", "Bleed"
    ))), .Names = c("cf", "w")), Enox = structure(list(cf = 0.9174, 
    w = structure(c(0.622923619837217, 0.110251595486162, 0.266824784676621
    ), .Names = c("Prox DVT", "Dist DVT", "Bleed"))), .Names = c("cf", 
"w"))), .Names = c("Hep", "Enox")), description = "Central weights", 
    type = "list"), .Names = c("data", "description", "type")), 
    ranks = structure(list(data = structure(list(Hep = c(0.1369, 
    0.8631), Enox = c(0.8631, 0.1369)), .Names = c("Hep", "Enox"
    )), description = "Rank acceptabilities", type = "list"), .Names = c("data", 
    "description", "type"))), .Names = c("cw", "ranks"))

actual <- run_smaa(params)
print(all.equal(expected$ranks, actual$ranks, tolerance=0.02))
print(all.equal(expected$cw, actual$cw, tolerance=0.05)) 

### Exact SWING
print("=== Exact SWING ===")

params$preferences <- list(
  list(criteria=c('Prox DVT', 'Bleed'),
       type='exact swing',
       ratio=2),
  list(criteria=c('Bleed', 'Dist DVT'),
       type='exact swing',
       ratio=2))

expected <-
  structure(list(cw = structure(list(data = structure(list(Hep = structure(list(
    cf = 0.1049, w = structure(c(0.571428571428571, 0.142857142857143, 
    0.285714285714286), .Names = c("Prox DVT", "Dist DVT", "Bleed"
    ))), .Names = c("cf", "w")), Enox = structure(list(cf = 0.8951, 
    w = structure(c(0.571428571428571, 0.142857142857143, 0.285714285714286
    ), .Names = c("Prox DVT", "Dist DVT", "Bleed"))), .Names = c("cf", 
"w"))), .Names = c("Hep", "Enox")), description = "Central weights", 
    type = "list"), .Names = c("data", "description", "type")), 
    ranks = structure(list(data = structure(list(Hep = c(0.1049, 
    0.8951), Enox = c(0.8951, 0.1049)), .Names = c("Hep", "Enox"
    )), description = "Rank acceptabilities", type = "list"), .Names = c("data", 
    "description", "type"))), .Names = c("cw", "ranks"))

actual <- run_smaa(params)
print(all.equal(expected$ranks, actual$ranks, tolerance=0.02))
print(all.equal(expected$cw, actual$cw, tolerance=0.05)) 
