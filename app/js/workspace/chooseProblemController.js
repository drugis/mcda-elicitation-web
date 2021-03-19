'use strict';
define(['lodash'], function (_) {
  var dependencies = ['PageTitleService'];

  var ChooseProblemController = function (PageTitleService) {
    PageTitleService.setPageTitle('ChooseProblemController', 'Workspaces');
  };
  return dependencies.concat(ChooseProblemController);
});
