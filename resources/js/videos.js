
function add_new_video(){
    id = 0;
    var data = {id};
    var data = JSON.stringify(data);
    $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"views/videos/form_videos.php",
      beforeSend: function(){
        //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
        close_box("Wait");
        style="z-index:2;width:auto;max-width:500px;";
        window_pop("Video",style,function(){
          if (r){
              qs("#Video #window_content").innerHTML = res;               
          }   
        });
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept");              
      }
  });            
}

function edit_video(obj){
    var id = $(obj).closest('.tr').attr('id');
    var data = {id};
    var data = JSON.stringify(data);
    $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"views/videos/form_videos.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
        //close_box("Wait");
        style="z-index:2;width:auto;max-width:500px;";
        window_pop("Cash_video",style,function(){
           if (r){
               qs("#Cash_video #window_content").innerHTML = res;               
           }   
        });
      },
      error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept");              
      }
    });               
}

function confirm_delete_video($id) {
  confirm_box("Question","Question","Are you sure to delete ?","No&Yes","",function(){
    if (r){
       delete_video($id);
    }
  });
}

function delete_video($id) { 
  alert("Video deleted");
}

function save_video(){
    // Getting data
    let form_id = "#form_videos";
    let form = qs(form_id);
    // Get all field data from the form
    let data = new FormData(form);
    data.append('m','save'); 
    let obj = {};
    obj = serialize(data);
    console.log(obj);

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
        url:"controllers/videosController.php",
        beforeSend: function(){
            //message_box("Wait","Wait","Processiog...please wait","Close");
        },
        success: function(res){
            //close_box("Wait");
            var res = JSON.parse(res);
            //alert(res.result);
            if (res.status == "success") {
                close_window("#Cash_video");
                confirm_box("Success","Success","Data was saved successfully.","Accept","",function(){
                    location.reload();
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