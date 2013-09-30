define(['angular'], function(angular) {
  return function() {
  this.fields = ["methods"];

  this.initialize = function(state) {
    var initialized = angular.copy(state);
    initialized.methods = {
      "ratio bound": "Continue with interval SWING weighting",
      "exact swing": "Continue with exact SWING weighting",
      "done": "Done eliciting preferences"};
    initialized.type = "choose method";
    return initialized;
  }

  this.validChoice = function(currentState) {
    return _.contains(_.keys(currentState.methods), currentState.choice);
  }

  this.nextState = function(currentState) {
    if (!this.validChoice(currentState)) return;
    var nextState = angular.copy(currentState);
    nextState.type = currentState.choice;
    delete nextState.choice;
    return nextState;
  }
};
});
