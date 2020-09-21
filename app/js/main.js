'use strict';
define([
  'angular',
  'mcdaweb',
  '../../public/css/mcda-drugis.css',
  'font-awesome/css/font-awesome.min.css',
  'angularjs-slider/dist/rzslider.css',
  'c3/c3.css'
], function () {
  window.patavi = {WS_URI: 'wss://patavi.drugis.org/ws'};

  window.config = {
    WS_URI: 'wss://patavi.drugis.org/ws',
    examplesRepository: 'examples/',
    workspacesRepositoryUrl: '/workspaces/'
  };
});
