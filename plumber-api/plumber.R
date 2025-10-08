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

#* @apiTitle MCDA SMAA API
#* @apiDescription Simple REST API for SMAA calculations, replacing Patavi

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

#* Main SMAA calculation endpoint
#* @post /smaa
#* @serializer json
function(req, res) {
  start_time <- Sys.time()
  
  tryCatch({
    # Parse JSON body using RJSONIO (same as old Patavi worker)
    params <- fromJSON(req$postBody)
    
    # Log the method being requested
    message(paste("Received /smaa request with method:", params$method))
    
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
    
    # Return results with metadata
    return(list(
      results = result,
      metadata = list(
        method = method,
        execution_time_seconds = round(execution_time, 3),
        timestamp = as.character(Sys.time())
      )
    ))
    
  }, error = function(e) {
    res$status <- 500
    message(paste("Error in SMAA calculation:", e$message))
    return(list(
      error = e$message,
      traceback = as.character(sys.calls())
    ))
  })
}

#* Legacy endpoint for compatibility (returns task-like structure)
#* This mimics the old Patavi response format
#* @post /task
#* @serializer json
function(req, res, service = "smaa_v2") {
  start_time <- Sys.time()
  
  tryCatch({
    # Parse JSON body using RJSONIO (same as old Patavi worker)
    params <- fromJSON(req$postBody)
    
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
    
    result <- do.call(function_name, list(params))
    
    # Calculate execution time
    execution_time <- as.numeric(difftime(Sys.time(), start_time, units = "secs"))
    
    # Return results (plumber handles synchronous response)
    res$status <- 200
    return(result)
    
  }, error = function(e) {
    res$status <- 500
    message(paste("Error in SMAA calculation:", e$message))
    return(list(
      error = e$message,
      traceback = as.character(sys.calls())
    ))
  })
}
