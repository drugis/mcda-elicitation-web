<!DOCTYPE html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="sf"%>
<%@ page session="false"%>

<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width" />
    <link rel="shortcut icon" href="<c:url value="/bower_components/mcda-web/app/img/favicon.ico" />" type="image/x-icon" />

    <title>mcda.drugis.org</title>

   <script src="bower_components/requirejs/require.js" data-main="app/js/main.js"></script>

  </head>

  <body>
    <form method="POST" action="<c:url value="/signout" />" id="signout_form">
      <input type="hidden" name="_csrf" value="<c:out value="${_csrf.token}" />" />
    </form>

    <div>
      <top-bar>
        <ul class="title-area">
          <li class="name">
            <h1><a href="#/">mcda.drugis.org</a></h1>
          </li>
        </ul>

        <top-bar-section>
          <!-- Right Nav Section -->
          <ul class="right">
            <li has-dropdown>
              <a href="#">
                <i class="fa fa-user fa-fw"></i>
                <c:out value="${account.firstName} ${account.lastName}" /></a>
              <ul top-bar-dropdown>
                <li><a href="#" onClick="signout()">Sign out</a></li>
              </ul>
            </li>
          </ul>
        </top-bar-section>
      </top-bar>
    </div>

    <section>
      <div class="color-stripe"></div>
    </section>

    <div ng-if="error" class="row" ng-cloak>
      <div class="columns">
      <addis-alert type="alert" close="error.close()">{{error.code}} {{error.cause}}<span ng-show="error.error">&mdash; {{error.error}}</span></addis-alert>
      </div>
    </div>


    <div ng-cloak class="row">
      <div class="columns">
        <addis-alert type="info">
          <strong>Disclaimer:</strong> this is <em>beta</em> software. We store your workspaces on our servers. While we try our best to keep them secure and compatible with future versions, we can make no guarantees.
        </addis-alert>
      </div>
    </div>

    <div ui-view></div>

    <div class="push"></div>

    <script>
     window.config = {
         WS_URI: 'wss://patavi.drugis.org/ws',
         workspacesRepositoryUrl: '/workspaces/',
         _csrf_token : "${_csrf.token}",
         _csrf_header : "${_csrf.headerName}",
         user : {
             id : ${account.id},
             name : "${account.firstName}",
             firstName : "${account.firstName}",
             LastName : "${account.lastName}"
         }
     };

     function signout(){
         var signoutForm = document.getElementById('signout_form');

         if(signoutForm){
             signoutForm.submit();
         }
     }
    </script>

  </body>
</html>
<link rel="stylesheet" type="text/css" href="bower_components/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="bower_components/jslider/dist/jquery.slider.min.css">
<link rel="stylesheet" type="text/css" href="bower_components/nvd3-community/build/nv.d3.min.css">

<link rel="stylesheet" type="text/css" href="<c:url value="/bower_components/mcda-web/app/css/mcda-drugis.css" />">
