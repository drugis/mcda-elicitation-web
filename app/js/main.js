'use strict';
define(['angular', 'mcdaweb'], function () {
  require('css/mcda-drugis.css');
  require('font-awesome/css/font-awesome.min.css'); 
  require('nvd3/build/nv.d3.css');
  require('angularjs-slider/dist/rzslider.css');
  require('c3/c3.css');

  window.patavi = { 'WS_URI': 'wss://patavi.drugis.org/ws' };

  window.config = {
    WS_URI: 'wss://patavi.drugis.org/ws',
    examplesRepository: 'examples/',
    workspacesRepositoryUrl: '/workspaces/',
  };

  function signout() {
    var signoutForm = document.getElementById('signout_form');
    if (signoutForm) {
      signoutForm.submit();
    }
  }
});
