<%--
    Document   : index
    Created on : Dec 15, 2013, 5:30:59 PM
    Author     : javier.solis.g
--%>
<%@page import="org.semanticwb.datamanager.*"%>
<!DOCTYPE html>
<html>
  <head>
    <title>SWBForms</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
		<link rel="manifest" href="/manifest.json">
		<meta name="theme-color" content="#ffffff">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script src="/platform/js/eng.js" type="text/javascript"></script>
  </head>
  <body>
    <h1>SWBForms</h1>
    <%
      SWBScriptEngine eng = DataMgr.initPlatform(session);
      DataObject user = eng.getUser();
      if(user!=null) {
        %>
        <h2>User</h2>
        <div>User: <%=user.getString("fullname")%></div>
        <div>Email: <%=user.getString("email")%> <div>
        <%
      }
    %>
    <h2>Paths</h2>
    <div><a href="/login">/login</a></div>
  </body>
</html>
