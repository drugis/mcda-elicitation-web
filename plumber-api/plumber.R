# MCDA SMAA Plumber API
# This replaces the complex Patavi architecture (patavi-server + worker + RabbitMQ)
# with a simple REST API

library(plumber)
library(RJSONIO)  # Use RJSONIO to match old Patavi worker behavior

# Load required R packages
library(MASS)
library(hitandrun)
library(smaa)
library(rcdd)
library(abind)

# Source all R calculation functions
source_files <- function(dir) {
  files <- list.files(dir, pattern = "\\.R$", full.names = TRUE)
  for (file in files) {
    tryCatch({
      source(file)
      message(paste("Loaded:", basename(file)))
    }, error = function(e) {
      warning(paste("Failed to load", basename(file), ":", e$message))
    })
  }
}

# Source main R files
source_files("/app/R")

# Source utility R files
source_files("/app/R/util")


#* Simple API key filter — require X-api-key for production endpoints
#* @filter apiKey
function(req, res) {
  # Allow open health and docs endpoints
  path <- req$PATH_INFO
  if (!is.null(path) && (path == "/health" || startsWith(path, "/__docs__/"))) {
    return(forward())
  }

  expected <- Sys.getenv('PATAVI_API_KEY', '')
  if (identical(expected, '')) {
    # Fail fast: treat missing configuration as a server error so deployments don't accidentally expose the API
    message('Error: PATAVI_API_KEY is not set in Plumber; rejecting requests')
    res$status <- 500
    return(list(error = 'Server misconfiguration: PATAVI_API_KEY not set'))
  }

  # Try common header locations
  provided <- NULL
  if (!is.null(req$HTTP_X_API_KEY)) provided <- req$HTTP_X_API_KEY
  if (is.null(provided) && !is.null(req$HEADERS[['x-api-key']])) provided <- req$HEADERS[['x-api-key']]

  if (is.null(provided) || provided != expected) {
    res$status <- 401
    return(list(error = 'Unauthorized: invalid or missing API key'))
  }

  forward()
}

#* @apiTitle MCDA SMAA API
#* @apiDescription Simple REST API for SMAA calculations, replacing Patavi

## NOTE: we will return pre-serialized JSON strings directly from handlers
## by setting res$body and Content-Type. Avoid registering custom @serializer
## annotations which must be known to plumber at parse-time.

#* Health check endpoint
#* @get /health
function() {
  list(
    status = "healthy",
    timestamp = as.character(Sys.time()),
    version = "1.0.0-plumber"
  )
}

#* Echo endpoint for testing
#* @post /echo
#* @serializer json
function(req) {
  list(
    received = req$postBody,
    timestamp = as.character(Sys.time())
  )
}

# Internal handler implementing SMAA logic (used by multiple routes)
handle_smaa <- function(req, res, service = NULL) {
  start_time <- Sys.time()

  tryCatch({
    # Parse JSON body using RJSONIO (same as old Patavi worker)
    params <- fromJSON(req$postBody)

    # Log the method being requested
    message(paste("Received SMAA request with method:", params$method))

    # Validate method
    allowed_methods <- c(
      'choiceBasedMatching',
      'deterministic',
      'indifferenceCurve',
      'matchingElicitationCurve',
      'representativeWeights',
      'scales',
      'sensitivityMeasurements',
      'sensitivityMeasurementsPlot',
      'sensitivityWeightPlot',
      'smaa'
    )

    method <- params$method
    if (is.null(method)) {
      res$status <- 400
      return(list(
        error = "Missing 'method' parameter",
        allowed_methods = allowed_methods
      ))
    }

    if (!(method %in% allowed_methods)) {
      res$status <- 400
      return(list(
        error = paste("Method", method, "not allowed"),
        allowed_methods = allowed_methods
      ))
    }

    # Set random seed
    if (!is.null(params$seed)) {
      set.seed(params$seed)
    } else {
      set.seed(1234)
    }

    # Call the appropriate R function
    function_name <- paste("run", method, sep = "_")
    message(paste("Calling function:", function_name))

    # Debug logging
    if (!is.null(params$sensitivityAnalysis)) {
      message(paste("DEBUG sensitivityAnalysis:", toString(params$sensitivityAnalysis)))
      message(paste("DEBUG names:", toString(names(params$sensitivityAnalysis))))
    }

    result <- do.call(function_name, list(params))

    # Debug logging for SMAA results
    if (method == "smaa") {
      message(paste("DEBUG SMAA result structure:", toString(names(result))))
      if (!is.null(result$results)) {
        message(paste("DEBUG SMAA results names:", toString(names(result$results))))
      }
    }

    # Calculate execution time
    execution_time <- as.numeric(difftime(Sys.time(), start_time, units = "secs"))

    # Build payload and serialize using RJSONIO so format matches old Patavi worker
    payload <- list(
      results = result,
      metadata = list(
        service = ifelse(is.null(service), NA, service),
        method = method,
        execution_time_seconds = round(execution_time, 3),
        timestamp = as.character(Sys.time())
      )
    )

    # Return pre-serialized JSON string directly in the response body so Plumber
    # does not re-serialize the structure (ensures old Patavi-shaped JSON).
    res$setHeader('Content-Type', 'application/json')
    res$status <- 200
    res$body <- RJSONIO::toJSON(payload, digits = 10)
    return(res)

  }, error = function(e) {
    res$status <- 500
    message(paste("Error in SMAA calculation:", e$message))
    return(list(
      error = e$message,
      traceback = as.character(sys.calls())
    ))
  })
}

#* Canonical SMAA endpoint (Patavi compatibility)
#* @post /smaa_v2
function(req, res) {
  handle_smaa(req, res, service = "smaa_v2")
}
