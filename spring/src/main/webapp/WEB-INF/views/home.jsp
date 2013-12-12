<!DOCTYPE html>
<html ng-app="elicit">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width" />

    <title>Preference elicitation</title>

    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/foundation/4.3.2/css/foundation.min.css">
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min.css">
    <link rel="stylesheet" type="text/css" href="app/js/lib/jslider/bin/jquery.slider.min.css">
    <link rel="stylesheet" type="text/css" href="app/css/nv.d3.css">
    <link rel="stylesheet" type="text/css" href="app/css/main.css">

    <script src="app/js/lib/modernizr.foundation.js"></script>

    <script src="app/js/lib/require.js" data-main="app/js/main.js"></script>

  </head>

  <body>

    <div ng-if="error" ng-cloak>
      <div class="alert-box alert">
        Computation failed: {{error.code}}
        <span ng-show="error.error">&mdash; {{error.error}}</span>
      </div>
    </div>

    <div ui-view></div>

    <script>
     window.config = { examplesRepository: "/mcda-web/examples/" };
    </script>

  </body>
</html>
