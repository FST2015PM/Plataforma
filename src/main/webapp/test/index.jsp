<%-- 
    Document   : index
    Created on : 04-dic-2016, 16:17:21
    Author     : javiersolis
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script src="/platform/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <h1>Hello World!</h1>
        <script type="text/javascript">
            eng.initPlatform("datasources.js",false);
            
            var pais=eng.createGrid({
                left:"-10", 
                margin:"10px", 
                width: "100%", 
                height: 200, 
                canEdit:false,
                canRemove:true,
                canAdd:true,
                fields: [
                    {name: "folio"},
                    {name: "fecha"},
                    {name: "total"},
                ],                
                recordDoubleClick: function(grid, record)
                {
                    window.location = "nota.jsp?id=" + record._id;
                    return false;
                },  
                addButtonClick: function(event)
                {
                    window.location = "nota.jsp";
                    return false;
                },               
            }, "Nota");          
            
            var detalleProducto=eng.createGrid({
                left:"-10", 
                margin:"10px", 
                width: "100%", 
                height: 200, 
                canEdit:true,
                canRemove:true,
                canAdd:true,
            }, "DetalleProducto");     
            
            var producto=eng.createGrid({
                left:"-10", 
                margin:"10px", 
                width: "100%", 
                height: 200, 
                canEdit:true,
                canRemove:true,
                canAdd:true,
            }, "Producto");    
            
            var producto=eng.createGrid({
                left:"-10", 
                margin:"10px", 
                width: "100%", 
                height: 200, 
                canEdit:true,
                canRemove:true,
                canAdd:true,
            }, "Cliente");             
        </script>        
    </body>
</html>

