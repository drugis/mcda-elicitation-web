'use strict';
define([
  '../../public/css/mcda-drugis.css',
  'font-awesome/css/font-awesome.min.css'
],
  function() {
    var xmlhttp;

    window.addEventListener('load', function() {
      var form = document.getElementById('localLoginForm');
      if(form){
      window.addEventListener('submit', function() {
          login(form);
        });
      }
    });

    function login(form) {
      xmlhttp = new XMLHttpRequest();
      xmlhttp.open(form.method, form.action, true);
      xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xmlhttp.send(JSON.stringify(
        {
          username: form.username.value,
          password: form.password.value
        }
      ));
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.status === 403) {
          var warningDiv = document.getElementById('loginWarning');
          warningDiv.innerHTML = 'Incorrect username or password.';
        }
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          window.location.reload(true);
        }
      };
      return false;
    }

  }
);
