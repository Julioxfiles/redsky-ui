
function add_new_user(){
  id = 0;
  var data = {m:"create",id};
  var data = JSON.stringify(data);
  $.ajax({
    type:"GET",
    datatype:"json",
    data:{"data":data},
    url:"users/create",
    beforeSend: function(){
      //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
    },
    success: function(res){
      close_box("Wait");
      style="z-index:2;width:auto;max-width:500px;";
      window_pop("User",style,function(){
        if (r){
           qs("#User #window_content").innerHTML = res;               
        }   
      });
    },
    error: function(jqXHR,textstatus,errorThrown){
      alert_box("Error","Error","An internal error has occurred.","Accept");              
    }
  });            
}

function edit_user(id){
  //function edit_user(obj){  
  //var id = $(obj).closest('.tr').attr('id');
  var data = {m:"update",id};
  var data = JSON.stringify(data);
  $.ajax({
    type:"GET",
    datatype:"json",
    data:{"data":data},
    url:`users/${id}/edit`,
    beforeSend: function(){
      //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
    },
    success: function(res){
      //close_box("Wait");
      style="z-index:2;width:auto;max-width:500px;";
      window_pop("User",style,function(){
        if (r){
          qs("#User #window_content").innerHTML = res;               
        }   
      });
    },
    error: function(jqXHR,textstatus,errorThrown){
      alert_box("Error","Error","An internal error has occurred.","Accept");              
    }
  });               
}

function confirm_delete_user(id) {
  confirm_box("Question","Question","Are you sure to delete ?","No&Yes","",function(){
    if (r){
       delete_user(id);
    }
  });
}

function delete_user(id) { 
  //const token = qs("token").value;
  console.log(`User ${id} deleted`);
  //obj = {id};
  //data = JSON.stringify(obj);
  $.ajax({
    type:"DELETE",
    datatype:"json",
    //data:{"data":data},
    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
    url:"users/"+id,
    beforeSend: function(){
       //message_box("Wait","Wait","Processiog...please wait","Close");
    },
    success: function(res){
      //close_box("Wait");
      //var res = JSON.parse(res);
      //alert(res.result);
      console.log(res.status);
      if (res.status == "200") {
          //close_window("#User");
          confirm_box("Success","Success","Record delete successfully.","Accept","",function(){
            //location.reload();
            qs("#card-"+id).remove()
          });    
      } else {
        confirm_box("Alert","Alert",res.status,"Accept","",function(){
            //location.reload();
        });    
      }
    },            
    error: function(jqXHR,textstatus,errorThrown){
       close_box("Wait");
       alert_box("Error","Error","An internal error has occurred.","Accept");
    }
  });        
}

function store_new_user(){
  // Getting data
  let form_id = "#form_users";
  let form = qs(form_id);
  // Get all field data from the form
  let data = new FormData(form);
  let obj = {};
  obj = serialize(data);
  //console.log(obj);

  // Validating data
  if (obj.name == "") {
    input_error(form_id+" #name","Este campo es requerido.");
    return false;
  }
 
  if (obj.branch_id == 0) { 
    confirm_box("Info","Info","You must select a branch.","Accept","",function(){
      if (!r) {
        qs(form_id+" #branch_id").focus();
      }
    });
    return false;
  }

  data = JSON.stringify(obj);
  $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
      url:`users/store`,
      beforeSend: function(){
          //message_box("Wait","Wait","Processiog...please wait","Close");
      },
      success: function(res){
          //close_box("Wait");
          //var res = JSON.parse(res);
          //alert(res.status);
          console.log(res.status);
          if (res.status == "201" ) {
             close_window("#User");
             confirm_box("Success","Success","Data was saved successfully.","Accept","",function(){
                //location.reload();
             });    
          } else {
            confirm_box("Alert","Alert",res.statusText,"Accept","",function(){
               location.reload();
            });    
          }
      },            
      error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait");
          alert_box("Error","Error","An internal error has occurred.","Accept");
      }
  });            
}

function update_user(){
    // Getting data
    let form_id = "#form_users";
    let form = qs(form_id);
    // Get all field data from the form
    let data = new FormData(form);
    let obj = {};
    obj = serialize(data);
    //console.log(obj);

    // Validating data
    if (obj.name == "") {
      input_error(form_id+" #name","Este campo es requerido.");
      return false;
    }
   
    if (obj.branch_id == 0) { 
      confirm_box("Info","Info","You must select a branch.","Accept","",function(){
        if (!r) {
          qs(form_id+" #branch_id").focus();
        }
      });
      return false;
    }

    data = JSON.stringify(obj);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        url:`users/${obj.id}/update`,
        beforeSend: function(){
            //message_box("Wait","Wait","Processiog...please wait","Close");
        },
        success: function(res){
            //close_box("Wait");
            //var res = JSON.parse(res);
            //alert(res.status);
            console.log(res.status);
            if (res.status == "200" ) {
                close_window("#User");
                confirm_box("Success","Success","Data was saved successfully. Click the accept button to reload or click the x to not. ","Accept","",function(){
                  if (!r) {
                    location.reload();
                  }
                });    
            } else {
              confirm_box("Alert","Alert",res.status,"Accept","",function(){
                 //location.reload();
              });    
            }
        },            
        error: function(jqXHR,textstatus,errorThrown){
            close_box("Wait");
            alert_box("Error","Error","An internal error has occurred.","Accept");
        }
    });            
}