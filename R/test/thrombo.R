library(RJSONIO)
library(smaa)
library(hitandrun)

update <- function(i) {}

source('../measurements.R')
source('../smaa.R')

params <- fromJSON('../../examples/thrombolytics.json')

print("=== CI hulls ===")
print(run_scales(params))
# [[1]]
# [[1]]$`Prox DVT`
#       2.5%      97.5% 
# 0.03158276 0.20029466 
# 
# [[1]]$`Dist DVT`
#      2.5%     97.5% 
# 0.1909199 0.3620560 
# 
# [[1]]$Bleed
#         2.5%        97.5% 
# 0.0003404137 0.0700511641 

print("=== Preference Free ===")
print(run_smaa(params))
# $cw
# $cw$data
# $cw$data$Hep
# $cw$data$Hep$cf
# [1] 0.6632
# 
# $cw$data$Hep$w
#  Prox DVT  Dist DVT     Bleed 
# 0.1923458 0.2727509 0.5349033 
# 
# 
# $cw$data$Enox
# $cw$data$Enox$cf
# [1] 0.8909
# 
# $cw$data$Enox$w
#  Prox DVT  Dist DVT     Bleed 
# 0.4054795 0.3649232 0.2295973 
# 
# 
# 
# $cw$description
# [1] "Central weights"
# 
# $cw$type
# [1] "list"
# 
# 
# $ranks
# $ranks$data
# $ranks$data$Hep
# [1] 0.3464 0.6536
# 
# $ranks$data$Enox
# [1] 0.6536 0.3464
# 
# 
# $ranks$description
# [1] "Rank acceptabilities"
# 
# $ranks$type
# [1] "list"

params$preferences <- list(
  list(criteria=c('Prox DVT', 'Bleed'),
       type='ordinal'),
  list(criteria=c('Bleed', 'Dist DVT'),
       type='ordinal'))
print("=== Interval SWING ===")
print(run_smaa(params))
# $cw
# $cw$data
# $cw$data$Hep
# $cw$data$Hep$cf
# [1] 0.1817
# 
# $cw$data$Hep$w
#  Prox DVT  Dist DVT     Bleed 
# 0.5300465 0.1195890 0.3503645 
# 
# 
# $cw$data$Enox
# $cw$data$Enox$cf
# [1] 0.9218
# 
# $cw$data$Enox$w
#  Prox DVT  Dist DVT     Bleed 
# 0.6238480 0.1105783 0.2655737 
# 
# 
# 
# $cw$description
# [1] "Central weights"
# 
# $cw$type
# [1] "list"
# 
# 
# $ranks
# $ranks$data
# $ranks$data$Hep
# [1] 0.1311 0.8689
# 
# $ranks$data$Enox
# [1] 0.8689 0.1311
# 
# 
# $ranks$description
# [1] "Rank acceptabilities"
# 
# $ranks$type
# [1] "list"

params$preferences <- list(
  list(criteria=c('Prox DVT', 'Bleed'),
       type='exact swing',
       ratio=2),
  list(criteria=c('Bleed', 'Dist DVT'),
       type='exact swing',
       ratio=2))
print("=== Exact SWING ===")
print(run_smaa(params))
# $cw
# $cw$data
# $cw$data$Hep
# $cw$data$Hep$cf
# [1] 0.1063
# 
# $cw$data$Hep$w
#  Prox DVT  Dist DVT     Bleed 
# 0.5714286 0.1428571 0.2857143 
# 
# 
# $cw$data$Enox
# $cw$data$Enox$cf
# [1] 0.8937
# 
# $cw$data$Enox$w
#  Prox DVT  Dist DVT     Bleed 
# 0.5714286 0.1428571 0.2857143 
# 
# 
# 
# $cw$description
# [1] "Central weights"
# 
# $cw$type
# [1] "list"
# 
# 
# $ranks
# $ranks$data
# $ranks$data$Hep
# [1] 0.1063 0.8937
# 
# $ranks$data$Enox
# [1] 0.8937 0.1063
# 
# 
# $ranks$description
# [1] "Rank acceptabilities"
# 
# $ranks$type
# [1] "list"
