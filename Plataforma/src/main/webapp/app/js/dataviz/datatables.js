/** Class to encapsulate data tables creation */
class DataTablesFactory {
  constructor() { }

  //TODO: Place specific code from here
  //DATATABLES DE JQUERY
  createDataTable(container, data, engine, options) {
    //Sample code
    $('#'+container).DataTable( {
        data: data
    } );
  }

  habilitarOpciones(container,data,paginacion,ordenar,informacion){
  $('#'+container).DataTable( {
      data: data
        "paging":   paginacion,
        "ordering": ordenar,
        "info":     informacion
    } );
  }

  scrollvertical(container,data){
  $('#'+container).DataTable( {
        data: data
    scrollY:        '50vh',
    scrollCollapse: true,
    paging:         false
} );
  }

  scrollhorizontal(container,data){
  $('#'+container).DataTable( {
        data: data
    "scrollX": true
} );
  }

//gijgo
      alinearTabla(container, data, alinear ){
      $('#'+container).grid({
        dataSource: data
        columns: [ align: alinear  ]
      });
      }

      ordenarTabla(container, data, ordenar){
      $('#'+container).grid({
          dataSource: data,
          columns: [sortable: ordenar]
        });
      }


     renombraColumna(container, data, columna, nuevoNombre){
       $('#'+container).grid({
            dataSource: data,
           columns: [ { field: columna , title: nuevoNombre }
           ]
       });

     }

     fontSize(container, data, size){
       $('#'+container).grid({
            dataSource: data,
            fontSize: size,
            columns: [ {field: 'Nombre' } ]
        });
     }

     activarBusqueda(container, data, activo){
       $('#'+container).grid({
            dataSource: data,
           headerFilter: activo,
           columns: [ { field: 'Nombre' } ]
       });

     }


    editarClick(container, data){
    var grid = $('#'+container).grid({
    dataSource: data,
    inlineEditing: { mode: 'dblclick' },
    columns: [
        { field: 'Nombre', editor: true }
    ]
    });
    }

    numPaginas(container, data, paginas){
    var grid = $('#'+container).grid({
    dataSource: data,
    columns: [  {field: 'Nombre'} ],
    pager: { limit: paginas }
    });
    }

    tablaResponsiva(container, data, activar){
    $('#'+container).grid({
    dataSource: data,
          responsive: activar,
          columns: [
              { field: 'Nombre' }
      });

    }

    botonesYtitulo(container, data, paginas){
    var grid = $('#'+container).grid({
    dataSource: data,
    uiLibrary: 'bootstrap',
    toolbarTemplate: '<div class="row"><div class="col-md-8" style="line-height:34px"><span data-role="title">Pruebas en Gijgo DataTables</span></div><div class="col-md-4 text-right"><button onclick="grid.reload()" class="btn btn-default">click here to refresh</button></div></div>',
    columns: [   { field: 'Nombre' }, { field: 'Salary' } ],
    pager: { limit: paginas }
    });
    }

    nombreTabla(container, data, nombreTab){
    $('#'+container).grid({
    dataSource: data,
    title: 'Players',
    columns: [{ field: 'Nombre' }, { field: 'Salary' } ]
    });
    }


    tamanoColumna(container, data, tamano){
    $('#'+container).grid({
    dataSource: data,
    width: tamano,
    columns: [{ field: 'Nombre' }, { field: 'Salary' } ]
    });
    }


}
