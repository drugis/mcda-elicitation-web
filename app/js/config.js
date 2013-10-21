define([], function() {
 this.tasks = {
      'available' : [
        { id: "overview",
          title: "Overview",
          controller: "OverviewController",
          templateUrl: "overview.html" },
        { id: "choose-problem",
          controller: "ChooseProblemController",
          templateUrl: "chooseProblem.html" },
        { id: "scale-range",
          title: "Define Scale Range",
          controller: 'ScaleRangeController',
          templateUrl: "scaleRange.html" },
        { id: "partial-value-function",
          title: "Define Partial Value Functions",
          controller: 'PartialValueFunctionController',
          templateUrl: "partialValueFunction.html" },
        { id: "ordinal-swing",
          title: "Ordinal Swing Elicitation",
          controller: 'OrdinalSwingController',
          templateUrl: 'ordinalSwing.html' },
        { id: "interval-swing",
          title: "Interval Swing Elicitation",
          controller: 'IntervalSwingController',
          templateUrl: 'intervalSwing.html' },
        { id: "exact-swing",
          title: "Exact Swing Elicitation",
          controller: 'ExactSwingController',
          templateUrl: 'exactSwing.html' },
        { id: "results",
          title: "Results",
          controller: 'ResultsController',
          templateUrl: 'results.html' }
      ]};
  return this;
});
