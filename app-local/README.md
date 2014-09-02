Standalone MCDA-web
===================

First, generate the `service.R` Patavi service by concatenating the
files in the `R/` subdirectory. You then need to run a Patavi server and workers
to serve this `service.R` file. The following is an example command to
start the worker:

    lein run --method smaa -n 1 \
             --file $MCDA_ROOT/R/service.R \
             --rserve --packages MASS,rcdd,hitandrun,smaa

The server is started with a simple `lein run` command. See the
[Patavi][patavi] documentation for how to set up Patavi.

If necessary, set the Patavi web service URI in the window.patavi
configuration. By default,

    window.patavi['WS_URI'] = "ws://localhost:3000/ws";

Then, serve the root of the repository using node.js, by typing

    npm install
    node index


[patavi]: https://github.com/joelkuiper/patavi
