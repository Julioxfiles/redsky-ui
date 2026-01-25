var window_width;

function draw_table( table_id, content, pagination, records_per_page){
   qs("#"+ table_id+"_content").html( content);
   // Paginacion
   draw_pagination( table_id, pagination, records_per_page);
}

function draw_pagination( table_id, pagination, records_per_page){
   var table = document.getElementById( table_id+"_content");
   var tr =  table.getElementsByClassName("tr");
   var records =  tr.length;
   var pages=parseInt(( records/ records_per_page)+1);
   //alert( records);
   //alert( records_per_page);
   //alert( pages);
   // pages=round( pages,0,PHP_ROUND_HALF_UP);
   var content="";
   for (var page=1; page<=  pages; page++){
        content =  content+"<div id='"+ page+"_page' class='page-number'>"+ page+"</div>";
   }
   qs("#"+ table_id+"_pagination").html( content);
}

function set_button( button, status, table_id){
   if ( status=="Enabled" ||  status=="enabled"){
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button).prop('disabled', false);
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button).removeAttr('disabled');
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button).classList.remove("disabled");
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button+" img").setAttribute("src","images/icon_"+ button+".png");
   }else if ( status=="Disabled" ||  status=="disabled"){
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button).prop('disabled', true);
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button).classList.add("disabled");
      qs("#table_bar_"+ table_id+" #"+ table_id+"-"+ button+" img").setAttribute("src","images/icon_"+ button+"_disabled.png");
   }
}

function toggle_selected_unselected_record( table_id, id){
   // Esta funcion hace que al dar click sobre un renglon se marque o desmarque como "selected".
   if ($("#"+ table_id+" #"+ id).hasClass("selected")){
       qs("#"+ table_id+" #"+ id).classList.remove("selected");
   }else{
       qs("#"+ table_id+" #"+ id).classList.add("selected");
   }
}

function toggle_select_unselect_records( db, table){
   // Esta funcion hace que al dar click sobre el boton select_all se marquen todos los registros no branddos y visceversa.
   var table_id="table_"+ table+"_content";
   var on_table = document.getElementById( table_id);
    tr =  on_table.getElementsByClassName("tr");
   for ( i=0; i< tr.length; i++){
       record =  tr[ i].getElementsByClassName("td")[1];
      var id =  record.innerHTML;
      if (qs("#"+ table_id+" #"+ id).hasClass("selected")){
         qs("#"+ table_id+" #"+ id).classList.remove("selected");
      }else{
         qs("#"+ table_id+" #"+ id).classList.add("selected");
      }
   }
   var table_id="table_"+ table;
   enable_or_disable_table_bar_buttons( table_id);
}

function set_record( table_id, id){
   //alert( table_id.id);
   toggle_selected_unselected_record( table_id.id, id);
   enable_or_disable_table_bar_buttons( table_id.id);
}

function set_record_and_click_edit_button( table_id, id){
   //alert( table_id.id);
   toggle_selected_unselected_record( table_id.id, id);
   enable_or_disable_table_bar_buttons( table_id.id);
    table =  table_id.id.slice(6);
   document.getElementById( table+"-edit").click();
   toggle_selected_unselected_record( table_id.id, id);
   enable_or_disable_table_bar_buttons( table_id.id);
}

function enable_or_disable_table_bar_buttons( table_id){
   var renglones = qs(""+ table_id+"_content .selected");
   var table_id =  table_id.slice(6);
   if ( renglones.length == 0){
      set_button("view","disabled", table_id);
      set_button("edit","disabled", table_id);
      set_button("delete","disabled", table_id);
   }else if ( renglones.length ==1){
      set_button("view","enabled", table_id);
      set_button("edit","enabled", table_id);
      set_button("delete","enabled", table_id);
   }else if ( renglones.length >= 2){
      set_button("view","disabled", table_id);
      set_button("edit","disabled", table_id);
      set_button("delete","enabled", table_id);
   }
}

function getidRecordSelected( db, table){
    var table = document.getElementById( table);
     tr =  table.getElementsByClassName("selected");
     ids_to_delete=[];
     id = '';
    for ( i=0; i< tr.length; i++){
       id =  tr[ i].getElementsByClassName("td")[1];
      alert( tr[ i].getElementsByClassName("td")[1]);
       id =  id.innerHTML;
    }
    //alert( id);
    return  id;
}

function getidsRecordsSelected( table){
   var table = document.getElementById( table);
    tr =  table.getElementsByClassName("selected");
    ids_to_delete=[];
    ids="";
   for ( i=0; i< tr.length; i++){
       id =  tr[ i].getElementsByClassName("td")[1];
       ids =  ids+","+ id.innerHTML;
   }
   return  ids;
}

function create_record( db, window, table){
   //alert( window_width);
   // style="background-color:#1B1B1B;width: window_width;max-width:100%;height:90%;top:10%;overflow-x:hidden;overflow-y:hidden;";
    style="background-color:#1B1B1B;width:90%;max-width:100%;height:90%;top:10%;overflow-x:hidden;overflow-y:hidden;";
   window_box( window, style);
   var data = {db: db,table: table};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/get_record_form.php",
      beforeSend: function(){
        // message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
        // close_box("Wait");
        qs("#"+ window+" #window_content").innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function read_record( db, table){
    //alert( table.id);
    // Aqui lo primero seria buscar el id del registro en base al renglon que tenga la clase selected.
    alert( table);
    id=getidRecordSelected( db, table);
    alert("Read:"+ id);
    // Y despues leer un formulario view.php y presentarlo en el contenido de una ventana modal.
}

function update_record( db, window, table, id){
    style="width:500px;max-width:100%;height:90%;top:10%;overflow-x:hidden;overflow-y:hidden;";
   window_box( window, style);
   if ( id==0){
        id=getidRecordSelected( db, table);
   }
   //var table="table_"+ table;
   var table =  table.substr(6);
   toggle_selected_unselected_record( table, id);
   //qs("#"+ table+" #window_content").html("");
   //open_window( table);
   var data = {db: db,table: table,id: id};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/get_record_form.php",
      beforeSend: function(){
        // message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
        // close_box("Wait");
        qs("#"+ window+" #window_content").innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });

}

function remove_deleted_records_from_table( table){
   ids=getidsRecordsSelected( table.id);
  var ids =  ids.split(",");
  // Convertir la cadena  ids en array  ids;
  for (var i=1; i< ids.length; i++){
      qs("#"+ table.id+" #"+ ids[ i]).remove();
  }
}

function remove_deleted_records_from_table( table){
   ids = getidsRecordsSelected( table.id);
  var ids =  ids.split(",");
  // Convertir la cadena  ids en array  ids;
  for (var i=1; i< ids.length; i++){
      qs("#"+ table.id+" #"+ ids[ i]).remove();
  }
}

function confirm_delete_records( db, table, id){
   //alert( db+" "+ table+" "+ id);
   confirm_box("Delete","Question","Are you sure to delete ?","No&Yes","No&Yes","",function(){
       if (r){
          delete_records( db, table, id);
       }
   });
}

function delete_records( db, table, id){
   //var table = qs("#table_"+ table);
   //alert( table);
   if ( id==0){
        id=getidsRecordsSelected( table);
   }
   var data = {db: db,table: table,ids: id};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/delete_records.php",
      beforeSend: function(){
        //qs("#resultado").html("Procesando...Espere por favor.");
      },
      success: function(res){
        close_box("Delete");
        var res = JSON.parse(res);
        if (res.status == "success") {
           //alert( table);
           // table =  table.substr(6);
           //alert( table);
           document.getElementById( table+"-reload").click();
        }
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function undelete_records( db, table, id){
   //var table = qs("#table_"+ table);
   //alert( table);
   if ( id==0){
        id=getidsRecordsSelected( table);
   }
   var data = {db: db,table: table,ids: id};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/undelete_records.php",
      beforeSend: function(){
        //qs("#resultado").html("Procesando...Espere por favor.");
      },
      success: function(res){
        close_box("Delete");
        var res = JSON.parse(res);
        if (res.status == "success") {
           //alert( table);
            table =  table.substr(6);
           //alert( table);
           document.getElementById( table+"-reload").click();
        }
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function change_status_records( db, table, id){
   //var table = qs("#table_"+ table);
   //alert( table);
   if ( id==0){
        id=getidsRecordsSelected( table);
   }
   var data = {db: db,table: table,ids: id};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/change_status_records.php",
      beforeSend: function(){
        //qs("#resultado").html("Procesando...Espere por favor.");
      },
      success: function(res){
        close_box("Delete");
        var res = JSON.parse(res);
        if (res.status == "success") {
           //alert( table);
           // table =  table.substr(6);
           //alert( table);
           location.reload();
           //document.getElementById( table+"-reload").click();
        }
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}


function print_records( ids, table){
   alert( table.id);
}

function reload_table( db, windows, table, columns, pixels){
    sql = qs("sql-"+ table).innerHTML;
   //var sql=btoa( sql);
   // sql = window.atob( data);
   //alert( sql;
   //location.href="monitor.php?&s="+ data;
   var data = {db: db,window: windows,table: table,sql: sql,columns: columns,pixels: pixels};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "views/"+ table+"/"+"table_"+ table+".php",
      beforeSend: function(){
        // message_box("Wait","Wait","Processiog...please wait.","Close");
      },
      success: function(res){
        // close_box("Wait");
        // Siempre recarga la tabla con el name de la ventana del formulario + una "s". Ejemplo: Category  => Categorys
        qs("#"+ windows+" #window_content").innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function export_to_csv( db, table, sql, columns){
   var data = {db: db,table: table,sql: sql,columns: columns};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/export_table_to_csv.php",
      beforeSend: function(){
        // message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
        // close_box("Wait");
        window.open("download_file.php?table="+ table,"_self");
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function export_to_pdf( db, table, sql, columns){
   var data = {db: db,table: table,sql: sql,columns: columns};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url: "libraries/table_crud/export_table_to_pdf.php",
      beforeSend: function(){
        // message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
        // close_box("Wait");
        window.open("view_pdf.php?file="+ table,"_self");
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function downloadCSV(csv,filename){
    var csvFile;
    var downloadLink;
    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
        csv.push(row.join(","));
    }
    // Download CSV file
    downloadCSV(csv.join("\n"),filename);
}

function filter_table( id_input, table, index){
  var input = qs(""+ id_input).val().toUpperCase();
  var table = document.getElementById( table.id);
  //alert( table);
  var tr =  table.getElementsByClassName("tr");
  var td="";
  // Bucle for a traves de todos los renglones para ocultar lo que no cumpla con la busqueda o filtro.
  for (var i=0; i< tr.length; i++) {
     td =  tr[ i].getElementsByClassName("td")[ index+1];
    if ( td) {
      if ( td.innerHTML.toUpperCase().indexOf( input) > -1) {
          tr[ i].style.display = "";
      } else {
          tr[ i].style.display = "none";
      }
    }
  }
}

function sort_table( table_id,n){
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById( table_id);
  switching = true;
  // Se inicia el orden en forma ASC (ascending o ascendente).
  dir = "asc";
  /* Hace un bucle que continuará hasta que se haga un switcheo */
  while (switching) {
    // Comienza cuando se dice: No se ha hecho switcheo
    switching = false;
    rows = table.rows;
    rows=table.getElementsByClassName("tr");
    /* Hace un bucle por todas los renglones de la tabla, excepto la primera, la cual contiene los titulos */
    // El siguiente bucle for comienza con la i con Value a 2 porque existen el tr de titles y el tr de filters, que son los renglones 0 y 1, respectivamente.
    for (i = 2; i < (rows.length - 1); i++) {
      // Comienza diciendo que no debe haber switcheo:
      shouldSwitch = false;
      // Obtiene los dos elements que tu quieres comparar, uno del renglon actual y uno del siguiente/
      x = rows[i].getElementsByClassName("td")[n];
      y = rows[i + 1].getElementsByClassName("td")[n];
      // // Checa si los dos renglones deben swichearse, basandose en la dir (ascendente o descendente)
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // Si asi es, entonces se brand un switcheo y se sale del bucle con break.
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // Si asi es, entonces se brand un switcheo y se sale del bucle con break.
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
       // Si un switcheo ha sido branddo, entonces se hace el switcheo y se brand que ese switcheo ha sido branddo.
       rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
       switching = true;
       // Cada vez que un switcheo se ha hecho, se incrementa el siguiente contador en 1;
       switchcount ++;
    }else{
      // Si no ha sido ejecutado ningun switcheo y la address es "asc" se asigna la address a "desc" y corre el bucle otra vez.
      if (switchcount == 0 && dir == "asc") {
         dir = "desc";
         switching = true;
      }
    }
  }
}

function echo_application_entity( id){
   data = {id};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"libraries/table_crud/echo_application_entity.php",
      beforeSend: function(){
         message_box("Wait","Wait","Processiog...please wait.");
      },
      success: function(res){
         close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
             message_box("Echo","Success","The modality has respond successfully.","Accept");
         }else{
             message_box("Error","Error","Could not find the ae title selected.","Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         message_box("Error","Error","An internal error has occurred.","Accept");
      }
   });
}

