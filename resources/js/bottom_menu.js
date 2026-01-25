
function bottom_menu($option){
    var data = {option:null};
    var data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"views/menus/bottom_menu.php",
        beforeSend: function(){
          //message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
          //close_box("Wait");
          style="z-index:2;width:100%;max-width:500px;height:100%;top:0%;overflow-x:hidden;overflow-y:hidden;";
          var l = $(".lds-ring").css("z-index");
              
          window_pop("Menu",style,function(){
              if (r){
                    qs("#Menu .windows-layout").innerHTML = res;
              }   
              var m = $("Menu .windows").css("z-index");
              //alert("m: "+$m+"l:  "+$l);
          });
          
        },
        error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
}
 
function open_option($option){
    var data = {option:$option};
    var data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"views/menus/bottom_menu.php",
        beforeSend: function(){
          //message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
          //close_box("Wait");
          style="z-index:2;width:100%;max-width:500px;height:100%;top:0%;overflow-x:hidden;overflow-y:hidden;";
          window_pop("Menu",style,function(){
              if (r){
                    qs("#Menu .windows-layout").innerHTML = res;    
              }   
          });
        },
        error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
 }
