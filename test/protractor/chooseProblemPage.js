var ChooseProblemPage = function(ptor) {

  this.ptor = ptor;

  this.getCurrentUrl = function() {
    return this.ptor.getCurrentUrl();
  };
};

module.exports = ChooseProblemPage;