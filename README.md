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

Running locally
---------------

For instructions to run the app locally, see the REAME.md in the app-local directory

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
