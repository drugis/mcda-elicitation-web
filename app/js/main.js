'use strict';
define(['angular', 'mcdaweb'], function () {
  require('css/mcda-drugis.css');
  require('font-awesome/css/font-awesome.min.css'); 
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
