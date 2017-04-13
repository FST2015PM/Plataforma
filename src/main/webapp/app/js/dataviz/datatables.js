/** Class to encapsulate data tables creation */
class DataTablesFactory {
  constructor() { }

  //TODO: Place specific code from here
  //DATATABLES DE JQUERY

  createDataTable(container, options = {asAjax: false, engine:"DataTables"}) {
    let _opts = {};
    if (typeof options === "object") {
      _opts = options;
    } else if (typeof options === "string") {
      _opts.ajax = options;
    } else {
      _opts.data = options;
    }

    if (!_opts.dataURL && !_opts.data) return;
    $('#'+container).DataTable(_opts);
  }

  /*habilitarOpciones(container,data,paginacion,ordenar,informacion){
  $('#'+container).DataTable( {
        data: data,
        "paging": paginacion,
        "ordering": ordenar,
        "info": informacion
    } );
  }

  scrollvertical(container,data){
    $('#'+container).DataTable( {
      data: data,
      scrollY: '50vh',
      scrollCollapse: true,
      paging: false
    });
  }

  scrollhorizontal(container,data){
    $('#'+container).DataTable( {
      data: data,
      "scrollX": true
    } );
  }*/

  /*remoteData(container, data){
  $('#'+container).DataTable( {
    ajax: {
        url: '/api/myData', //archivo
        dataSrc: data
    },
    columns: [ ... ]
} );
  }*/

/*En  gijgo para un archivo remoto

  remoteData(){
  $('#grid').grid({
  dataSource: '/Grid/GetPlayers', //archivo
  columns: [ { field: 'Name' }, { field: 'PlaceOfBirth' } ]
     });
}

 //Gijgo
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
  informacionExtra(container, data){
    $('#'+container).grid({
         dataSource: data,
         uiLibrary: 'bootstrap',
         columns: [
               title: 'Info', field: 'Info', width: 34, type: 'icon', icon: 'glyphicon-info-sign',
               events: {
                 'click': function (e) {
                     alert('record with id=' + e.data.id + ' is clicked.');
                 }
               }
             }
         ]
     });


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



    agregarRegistro(container, data){
    var grid = $('#'+container).grid({
    dataSource: data,
    primaryKey: 'ID',
    inlineEditing: { mode: 'command' },
    uiLibrary: 'bootstrap',
    columns: [

        { field: 'Nombre', editor: true }

    ],
    pager: { limit: 3 }
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

*/


}
