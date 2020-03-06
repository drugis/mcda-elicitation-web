library(testthat)
library(smaa)

args = commandArgs(trailingOnly=TRUE)

if (length(args) > 0 && args[1] == 'root') {
  filePathPrefix <- 'R/'
  testFolderPathPrefix <- 'R/unit-tests/'
} else {
  filePathPrefix <- '../'
  testFolderPathPrefix <- ''
}


entryFiles <- list.files(
  path = filePathPrefix,
  pattern = '*.R'
)

utilFiles <- list.files(
  path = paste(filePathPrefix, 'util/', sep = ''),
  pattern = '*.R'
)

for (fileName in entryFiles) {
  fullPath <- paste(filePathPrefix, fileName, sep='')
  source(fullPath)
}

for (fileName in utilFiles) {
  fullPath <- paste(filePathPrefix, 'util/', fileName, sep='')
  source(fullPath)
}

testFolderPath <- paste(testFolderPathPrefix, 'tests', sep='')
test_dir(testFolderPath)
