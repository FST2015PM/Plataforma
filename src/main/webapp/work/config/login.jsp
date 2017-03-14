<%@page import="org.semanticwb.datamanager.*"%><%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
String logoutAction=request.getParameter("logout");
String email=request.getParameter("email");
String password=request.getParameter("password");

if (null != logoutAction && "true".equals(logoutAction)) {
  session.removeAttribute("_USER_");
  response.sendRedirect("/login");
} else {
  if(email!=null && password!=null) {
    SWBScriptEngine engine=DataMgr.initPlatform(session);
    SWBDataSource ds=engine.getDataSource("User");
    DataObject r=new DataObject();
    DataObject data=new DataObject();
    r.put("data", data);
    data.put("email", email);
    data.put("password", password);
    DataObject ret=ds.fetch(r);

    DataList rdata=ret.getDataObject("response").getDataList("data");

    if(!rdata.isEmpty())
    {
      session.setAttribute("_USER_", rdata.get(0));
      response.sendRedirect("/app/#/admin/");
      return;
    }
  }
}
%><!DOCTYPE html>
<html>
  <head>
    <title>Iniciar sesión</title>
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
        <h2 class="form-signin-heading">Iniciar sesión</h2>
        <input name="email" type="email" class="form-control" placeholder="Email" required autofocus>
        <input name="password" type="password" class="form-control" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
        <p class="text-muted text-center"><small>¿Aún no tiene una cuenta?</small></p>
        <a href="/register" class="btn btn-sm btn-block">Crear una cuenta</a>
      </form>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>
