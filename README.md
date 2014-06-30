mcda-elicitation-web
====================

This tool provides a web interface for Multiple Criteria Decision
Analysis preference elicitation. Currently, it supports eliciting the
following types of preference information:

 - Linear partial value functions
 - Piece-wise linear partial value functions using MACBETH
 - Ordinal criteria trade-offs (ordinal SWING)
 - Exact criteria trade-off ratios (exact SWING)
 - Imprecise criteria trade-off ratios (interval SWING)

The tool uses the [Patavi][patavi] web service wrapper for R and the
'hitandrun' and 'smaa' R packages to calculate MCDA results during and
after the preference elicitation process.

mcda-elicitation-web is a component of the [drugis.org][drugis] ADDIS 2
project.

Running
-------

First, generate the `service.R` Patavi service by concatenating the
files in the `R/` subdirectory. On a UNIX system, run `make` from the
root of the repository. You then need to run a Patavi server and workers
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

Then, serve the root of the repository using any static web server, for
example:

    python -m SimpleHTTPServer 3001

Compiling the CSS
-----------------

Using compass (through `config.rb`):

```
compass compile
```

Using node-sass:

```
node-sass --include-path sass-shared sass/mcda-plain.scss app/css/mcda-plain.css
node-sass --include-path sass-shared sass/mcda-drugis.scss app/css/mcda-drugis.css
node-sass --include-path sass-shared sass/mcda-drugis-ie8.scss app/css/mcda-drugis-ie8.css
```

License
-------

mcda-elicitation-web is open source, and licensed under [GPLv3][gpl-3].
See [LICENSE.txt](LICENSE.txt) for more information.

[patavi]: https://github.com/joelkuiper/patavi
[gpl-3]: http://gplv3.fsf.org/
[drugis]: http://drugis.org/
