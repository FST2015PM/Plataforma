<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.semanticwb.datamanager.*, java.io.IOException, java.util.Date"%>
<%!
	private DataObject getTokenObject(SWBScriptEngine engine, String resetToken) {
		SWBDataSource ds = engine.getDataSource("ResetPasswordToken");
		DataObject r = new DataObject();
		DataObject data = new DataObject();
		r.put("data", data);
		data.put("token", resetToken);

		DataObject tokenObj = null;
		try {
			DataObject query = ds.fetch(r);
		  DataList rdata = query.getDataObject("response").getDataList("data");

	  	if(!rdata.isEmpty()) {
	  		tokenObj = rdata.getDataObject(0);
	  	}
		} catch (IOException ioex) {
			ioex.printStackTrace();
		}

		return tokenObj;
	}

	private boolean isTokenValid(SWBScriptEngine engine, DataObject tokenObj) {
    if (null != tokenObj) {
    	long tokenExp = tokenObj.getLong("expiration");
    	long now = new Date().getTime();

    	if (now < tokenExp) {
    		return true;
    	} else {
    		SWBDataSource ds = engine.getDataSource("ResetPasswordToken");
    		try {
    			ds.removeObj(tokenObj);
    		} catch (IOException ioex) {
    			ioex.printStackTrace();
    		}
    	}
    }
    return false;
	}
%>
<%
	SWBScriptEngine engine = DataMgr.initPlatform(session);
	String token = request.getParameter("resetToken");
  String password = request.getParameter("password");
  String password2 = request.getParameter("password2");

  //Redirect on token empty
  if (null == token || token.isEmpty()) {
	  response.sendRedirect("/login");
	  return;
  }

  //Get token object
  DataObject tokenObj = getTokenObject(engine, token);

  //Redirect on invalid token
  if (!isTokenValid(engine, tokenObj)) {
	  response.sendRedirect("/login");
	  return;
  }

  //Update user if password provided
  if (null != password && null != password2) {
		//Get user associated to token
	  SWBDataSource ds = engine.getDataSource("User");
	  DataObject userObj = null;
	  if (null != tokenObj) {
		  userObj = ds.fetchObjById(tokenObj.getString("user"));
	  }

	  //Update user password
		if(null != userObj && password.equals(password2)) {
    	userObj.put("password", password);
    	ds.updateObj(userObj);

    	//Remove reset token
    	ds = engine.getDataSource("ResetPasswordToken");
   		try {
 				ds.removeObj(tokenObj);
   		} catch (IOException ioex) {
   			ioex.printStackTrace();
   		}
	    response.sendRedirect("/login");
  	  return;
     }
   }
%>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="">
    <meta name="author" content="">
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
		<link rel="manifest" href="/manifest.json">
		<meta name="theme-color" content="#ffffff">

    <title>Register</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="app/lib/animate.css/animate.min.css">
    <style type="text/css">
      body{padding-top:50px;background-color:#eee}
      .form-signin{max-width:330px;padding:15px;margin:0 auto}
      .form-signin .form-control{position:relative;height:auto;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:10px;font-size:16px;margin-bottom:10px}
      .form-signin .form-control:focus{z-index:2}
    </style>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container animated fadeInDown">
      <form class="form-signin" action="" method="post">
        <h2 class="form-signin-heading">Cambiar password</h2>
        <input name="password" type="password" class="form-control" placeholder="Password" required>
        <input name="password2" type="password" class="form-control" placeholder="Confirm password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Actualizar</button>
      </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>
