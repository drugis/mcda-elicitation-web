#!/usr/bin/env Rscript
## Run SMAA functions directly with the sample request and dump raw R objects for inspection

## Ensure required packages are loaded (these are required by the project's R scripts)
required_pkgs <- c('RJSONIO', 'smaa', 'MASS', 'hitandrun', 'abind', 'rcdd')
missing_pkgs <- required_pkgs[!sapply(required_pkgs, requireNamespace, quietly = TRUE)]
if (length(missing_pkgs) > 0) {
  stop(paste('Missing required R packages:', paste(missing_pkgs, collapse = ', '),
             '\nInstall them with install.packages() or ensure the Docker image has them.'))
}
suppressPackageStartupMessages({
  lapply(required_pkgs, library, character.only = TRUE)
})

source_files <- function(dir) {
  files <- list.files(dir, pattern = "\\.R$", full.names = TRUE)
  for (file in files) {
    tryCatch({
      source(file)
      message(paste0('Loaded: ', basename(file)))
    }, error = function(e) {
      warning(paste('Failed to load', basename(file), ':', e$message))
    })
  }
}

## Source project R code (assumes script run from project root)
source_files('R')
if (dir.exists('R/util')) {
  source_files('R/util')
}

## Read sample request
request_file <- 'test/fixtures/smaa-request.json'
if (!file.exists(request_file)) {
  stop(paste('Request file not found:', request_file))
}

params <- RJSONIO::fromJSON(request_file)

## If the request contained a top-level wrapper (like results or task), try to extract the params
if (!is.null(params$params) && is.list(params$params)) {
  params <- params$params
}

message('Calling internal SMAA function(s) with parsed params...')

## Attempt to call getSmaaResults (raw internal structure) if available, otherwise fall back to run_smaa
raw_results <- NULL
if (exists('getSmaaResults')) {
  tryCatch({
    raw_results <- getSmaaResults(params)
  }, error = function(e) {
    message('getSmaaResults failed: ', e$message)
    raw_results <<- NULL
  })
}

formatted_results <- NULL
if (is.null(raw_results) && exists('run_smaa')) {
  tryCatch({
    formatted_results <- run_smaa(params)
  }, error = function(e) {
    message('run_smaa failed: ', e$message)
    formatted_results <<- NULL
  })
} else if (!is.null(raw_results) && exists('formatSmaaResults')) {
  ## Show what formatSmaaResults does to the raw structure for parity with plumber output
  tryCatch({
    formatted_results <- formatSmaaResults(raw_results, names(params$alternatives))
  }, error = function(e) {
    message('formatSmaaResults failed: ', e$message)
    formatted_results <<- NULL
  })
}

# Dump outputs for inspection
out_rds <- '/tmp/smaa-raw-output.rds'
out_txt <- '/tmp/smaa-raw-output.txt'

saveRDS(list(params = params, raw = raw_results, formatted = formatted_results), file = out_rds)

capture_lines <- capture.output({
  cat('--- Parsed params ---\n')
  str(params)
  cat('\n--- Raw results (getSmaaResults) ---\n')
  if (!is.null(raw_results)) str(raw_results) else cat('NULL\n')
  cat('\n--- Formatted results (formatSmaaResults / run_smaa) ---\n')
  if (!is.null(formatted_results)) str(formatted_results) else cat('NULL\n')
})

writeLines(capture_lines, con = out_txt)

## Serialize formatted results using jsonlite and RJSONIO for comparison
jsonlite_file <- '/tmp/smaa-json-jsonlite.json'
rjsonio_file <- '/tmp/smaa-json-rjsonio.json'
tryCatch({
  if (!is.null(formatted_results)) {
    # jsonlite: use auto_unbox to mirror plumber typical usage; use na='null' to represent R NA as JSON null
    jsonlite::write_json(formatted_results, path = jsonlite_file, auto_unbox = TRUE, na = 'null', digits = 10)

    # RJSONIO: use toJSON and write the string to file (older Patavi worker relied on RJSONIO)
    rjsonio_json <- RJSONIO::toJSON(formatted_results, digits = 10)
    write(rjsonio_json, file = rjsonio_file)

    message(paste('Wrote JSON (jsonlite):', jsonlite_file))
    message(paste('Wrote JSON (RJSONIO):', rjsonio_file))
  } else {
    message('No formatted_results available to serialize to JSON')
  }
}, error = function(e) {
  message('JSON serialization failed: ', e$message)
})

message(paste('Wrote RDS:', out_rds))
message(paste('Wrote human-readable dump:', out_txt))
message('Done.')
