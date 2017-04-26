<%@page import="org.semanticwb.datamanager.*"%><%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
  String logoutAction=request.getParameter("logout");
  String email=request.getParameter("email");
  String password=request.getParameter("password");

  boolean hasError = false;

  if (null != logoutAction && "true".equals(logoutAction)) {
    session.removeAttribute("_USER_");
    response.sendRedirect("/");
    return;
  }

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
    if(!rdata.isEmpty()) {
      rdata.remove("password");
      session.setAttribute("_USER_", rdata.get(0));
      response.sendRedirect("/app/#/admin/");
      return;
    } else {
      hasError = true;
    }
  }
%>
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  		<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
  		<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
  		<link rel="manifest" href="/manifest.json">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet">
      <title>Plataforma de Información Asociada a Pueblos Mágicos</title>
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
      <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
      <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
      <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
      <![endif]-->
      <link rel="stylesheet" href="/public/css/styles.css">
      <link rel="stylesheet" href="/app/lib/animate.css/animate.min.css">
      <script src="/platform/js/eng.js" type="text/javascript"></script>
   </head>
   <body id="image">
      <header>
         <div class="container text-center animate fadeIn">
            <h2><img src="/android-chrome-512x512.png" style="max-height:74px;">Plataforma de Información Asociada a Pueblos Mágicos</h2>
         </div>
      </header>
      <section class="content-back">
         <div class="container">
            <div id="carrusel" class="col-md-8">
               <div id="myCarousel" class="carousel slide" data-ride="carousel" data-interval="false">
                  <!-- Wrapper for slides -->
                  <div class="carousel-inner" role="listbox">
                     <div class="item active">
                        <span class="more">
                           <h2>Bienvenido</h2>
                           La PLATAFORMA DE INTEGRACIÓN DE INFORMACIÓN HETEROGÉNEA ASOCIADA A DESTINOS TURÍSTICOS provee mecanismos para acelerar la captura e integración de información de fuentes diversas, asociadas al sector turístico, mediante su estructuración y explotación para apoyar en la caracterización y análisis de los destinos.
                        </span>
                        <div class="clear">&nbsp;</div>
                        <div class="clear">&nbsp;</div>
                     </div>
                     <!--div class="item">
                        <span class="more">
                           <h2>Bienvenido</h2>
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum enim tortor, aliquet nec commodo ac, finibus id ligula. Aliquam a viverra eros. Sed tincidunt blandit massa, ac placerat arcu euismod vitae. Nam ut mauris vel dolor venenatis vehicula. Quisque porta sem a est ullamcorper mollis in eu eros. Cras mattis lorem sed facilisis ultricies. Donec vitae bibendum massa. Ut in convallis quam. Cras ultrices metus erat, nec mollis quam dignissim nec. Curabitur vel lorem eget dolor facilisis vehicula. Suspendisse vel suscipit ante. Aenean aliquam at lorem ac bibendum. Nulla vel fermentum nulla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.<br><br>
                           Donec sagittis interdum risus, sed placerat sapien iaculis quis. Integer ut lorem eu odio iaculis pretium nec et arcu. Cras elementum nisi interdum vulputate vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla id diam et tortor ultrices tincidunt. Vivamus vitae elementum diam. Sed lacinia, enim non consectetur placerat, ex felis viverra nisl, a pharetra ante odio id libero. Vivamus ac eros laoreet, pharetra felis ut, lacinia lectus. Sed vitae quam cursus, tempus nisl at, tincidunt lacus. Phasellus ultrices efficitur nibh, bibendum maximus sapien sodales vel. Maecenas ultricies ullamcorper velit eget bibendum. In eget semper erat, id vulputate risus. Maecenas eu nisi non nunc gravida semper. Etiam at turpis maximus, semper arcu pretium, feugiat magna. Integer molestie sollicitudin condimentum. Donec vel placerat justo.
                        </span>
                        <div class="clear">&nbsp;</div>
                        <div class="clear">&nbsp;</div>
                     </div-->
                  </div>
                  <!-- Left and right controls -->
                  <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                  <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                  <span class="sr-only">Anterior</span>
                  </a>
                  <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                  <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                  <span class="sr-only">Siguiente</span>
                  </a>
               </div>
               <div class="clear"></div>
            </div>
            <div id="login" class="col-md-4">
               <div class="forms-container" style="padding:10px;">
                  <form class="form" method="post" action="/">
                     <div class="form-group">
                        <label class="sr-only" aria-hidden="true">Usuario</label>
                        <input placeholder="email" class="form-control" name="email" type="email" required autofocus="true">
                     </div>
                     <div class="form-group">
                        <label class="sr-only">Contraseña</label>
                        <input placeholder="Password" class="form-control" name="password" type="password" required>
                     </div>
                     <div class="form-group" style="position: relative;">
                        <label class="control-label sr-only" style="display: block;">Submit</label>
                        <button type="submit" class="btn btn-block btn-primary">Iniciar sesión</button>
                     </div>
                     <%
                     if (hasError) {
                       %>
                       <div class="alert alert-danger animate fadeIn">
                         <p>El usuario o la contraseña no son válidos</p>
                       </div>
                       <%
                     }
                     %>
                  </form>
               </div>
            </div>
         </div>
      </section>
      <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
      <!-- Include all compiled plugins (below), or include individual files as needed -->
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
      <script type="text/javascript">
         window.onload=function(){
         var thediv=document.getElementById("image");
         var imgarray = new Array ("/public/images/back_01.jpg", "/public/images/back_02.jpg", "/public/images/back_03.jpg", "/public/images/back_04.jpg", "/public/images/back_05.jpg", "/public/images/back_06.jpg");
         var spot =Math.floor(Math.random()* imgarray.length);
         thediv.style.background="url("+imgarray[spot]+")no-repeat fixed right center / cover ";
         }
      </script>
      <script>
         $(document).ready(function() {
         // Configure/customize these variables.
         var showChar = 500;  // How many characters are shown by default
         var ellipsestext = "...";
         var moretext = "Ver más >";
         var lesstext = "Cerrar";


         $('.more').each(function() {
         var content = $(this).html();

         if(content.length > showChar) {

          var c = content.substr(0, showChar);
          var h = content.substr(showChar, content.length - showChar);

          var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

          $(this).html(html);
         }

         });

         $(".morelink").click(function(){
         if($(this).hasClass("less")) {
          $(this).removeClass("less");
          $(this).html(moretext);
         } else {
          $(this).addClass("less");
          $(this).html(lesstext);
         }
         $(this).parent().prev().toggle();
         $(this).prev().toggle();
         return false;
         });
         });
      </script>
   </body>
</html>
