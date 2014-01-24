<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width" />
<link rel="shortcut icon" href="<c:url value="/app/img/favicon.ico" />" type="image/x-icon" />

<title>mcda.drugis.org</title>

<link rel="stylesheet" type="text/css" href="<c:url value="/app/js/bower_components/font-awesome/css/font-awesome.min.css" />">

<!-- Foundation 3 for IE 8 and earlier -->
<!--[if lt IE 9]>
<link rel="stylesheet" href="<c:url value="/app/css/mcda-drugis-ie8.css" />">
<![endif]-->
<!-- Foundation 5 for IE 9 and earlier -->
<!--[if gt IE 8]><!-->
<link rel="stylesheet" href="<c:url value="/app/css/mcda-drugis.css" />">
<!--<![endif]-->
<script type="text/javascript" src="<c:url value="/app/js/bower_components/foundation/js/vendor/custom.modernizr.js" />"></script>
<script type="text/javascript" src="<c:url value="/app/js/bower_components/bowser/bowser.min.js" />"></script>

</head>

<body>
  <div class="alert-box warning" style="display:none; margin-bottom: 0px;" id="browserCheck">
    Your browser, <span id="browserVersion1"></span>, is <b>out of date</b>.
    It has known <b>security flaws</b> and will <b>not run this web application correctly</b>.<br>
    <a href="http://browser-update.org/update-browser.html#drugis.org">Please update your browser</a> before continuing.
  </div>
  <div class="alert-box warning" style="display:none; margin-bottom: 0px;" id="browserUnknown">
    Your browser is unknown to us.
    This web application may or may not work correctly using it.
    Proceed at your own risk, or <a href="http://browser-update.org/update-browser.html#drugis.org">download a well-known browser</a> before continuing.
  </div>
  <script type="text/javascript">
  if (bowser.c || (bowser.msie && bowser.version <= 8)) {
    document.getElementById("browserVersion1").innerHTML = bowser.name + " " + bowser.version;
    document.getElementById("browserCheck").style.display = "block";
  }
  if (bowser.x) {
    document.getElementById("browserUnknown").style.display = "block";
  }
  </script>

  <nav class="top-bar" data-topbar>
    <ul class="title-area">
      <li class="name">
        <h1>
          <a href="#">mcda.drugis.org</a>
        </h1>
      </li>
    </ul>
  </nav>

  <section id="hero">
    <div class="row">
      <div class="large-12 columns">
        <h1>mcda.drugis.org <br/>
          <small>Decision analysis for drug benefit-risk assessment</small>
        </h1>
             
      </div>
    </div>
  </section>
  <section class="content">
    <div class="row">
      <div class="columns">
        <p><a href="#">mcda.drugis.org</a> is designed to help policy makers and researchers judge the balance of favorable and unfavorable effects of medicines.
        This tool is intended to be part of the <a href="http://drugis.org/software/addis2">ADDIS 2</a> decision support system for health care policy.
        Until then, it serves as a demonstration of our multiple criteria decision analysis (MCDA) methods and our future direction in the development of ADDIS.</p>
        
        <div>
          <a class=" button" href="auth/google?scope=openid%20email%20profile">Sign In with Google</a>
        </div>
        
        <p>Right now, you need a Google account to sign in. The information we retrieve from Google is only used to ensure that you continue to have access to the workspaces you create.</p>
      </div>
    </div>
  </section>
</body>
</html>
