<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="sf" %>
<%@ page session="false" %>

<!DOCTYPE html>
<html ng-app="elicit">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width" />

    <title>Preference elicitation</title>
	<link rel="stylesheet" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" >
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/nprogress/0.1.2/nprogress.min.css">
    <link rel="stylesheet" type="text/css" href="app/js/lib/jslider/bin/jquery.slider.min.css">
    <link rel="stylesheet" type="text/css" href="app/css/nv.d3.css">
    <link rel="stylesheet" type="text/css" href="app/css/mcda-drugis.css">

    <script src="app/js/lib/modernizr.foundation.js"></script>
    <script src="app/js/lib/require.js" data-main="app/js/main.js"></script>

  </head>

  <body>
  
  	<p>Welcome, <c:out value="${account.username}"/>!</p>
  	
  	<form method="POST" action="<c:url value="/signout" />">
		<input type="hidden" name="_csrf" value="<c:out value="${_csrf.token}" />" />
		<button>Sign Out</button>
	</form>
  
    <div ng-if="error" ng-cloak>
      <div class="alert-box alert">
        Computation failed: {{error.code}}
        <span ng-show="error.error">&mdash; {{error.error}}</span>
      </div>
    </div>

    <div ui-view></div>

    <script>
     window.config = { examplesRepository: "examples/",
    		 workspacesRepository: {
    			 service: "RemoteWorkspaces",
    			 url: "workspaces/",
        		 _csrf_token: "${_csrf.token}",
        		 _csrf_header: "${_csrf.headerName}"
    		 }
   		 };
    </script>

  </body>
</html>
