
function open_window($title){
   $("#"+$title).show();
   $("#"+$title).css("visibility","visible");
   $("#"+$title+".windows").show();
   $("#"+$title+".windows").css("visibility","visible");
}

function close_window($title){
   $($title).hide();
   $($title).remove();
}

function open_box($title){
   $("#"+$title).show();
   $("#"+$title).css("visibility","visible");
   $("#"+$title+".windows").show();
   $("#"+$title+".windows").css("visibility","visible");
}

function close_box($title){
   $("#"+$title).hide();
   $("#"+$title).remove();
}

function window_box($title,$style){
   var data = {title:$title,style:$style};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/window_box.php",
   })
   .done( function (data) {
       if (!$("#"+$title).length) {
           $("body").append(data);
       } 
       $("#"+$title+" .active_window").draggable({ handle: "#title" });
       open_window($title);
       close_window_when_press_escape_key($title);
       $("#"+$title+" #Close-button").click(function(){
          close_window($title);
          $("#"+$title).remove();
          return false;
       });
       return r;
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}

function window_pop(title,style,callback){
   var data = {title,style};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/window_pop.php",
   })
   .done( function (data) {
       if (!$("#"+title).length) {
           $("body").append(data);
       } 
       $("#"+title+" .active_window").draggable({ handle: "#title" });
       var el = qs("#"+title+" .active_window");
       var position = (lastKnownScrollPosition * 2);
       el.style.top = position + 'px';
       open_window(title);
       //close_window_when_press_escape_key($title);
       $("#"+title+" .active_window").focus();
       window.addEventListener('keydown', function (event) {
         if (event.key === 'Escape') {
             if ($("#"+title+" .active_window").is(":focus")) {
                 close_box(title);
                 r=false;
                 callback(r);
             }    
         }
       })
       $("#"+title+" #Close-button").click(function(){
          close_window(title);
          $("#"+title).remove();
          r=false;
          callback(r);
       });
       r=true;
       callback(r);
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}

function close_window_when_press_escape_key($window){
   $("#"+$window).on('keydown',function ( e ) {
     if ( e.keyCode === 27 ) { // ESC
        $("#"+$window).hide();
        $("#"+$window).remove();
     }
   });
}

function confirm_box(title,type,message,buttons,onclose,callback){
   var buttons = buttons.split("&");
   var data = {title,type,message,buttons,onclose};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/confirm_box.php",
   })
   .done( function (data) {
       if (!$("#"+title).length) {
           $("body").append(data);
       } 
       $("#"+title+" .active_window").draggable({ handle: "#title" });
       var el = qs("#"+title+" .active_window");
       var position = ((vscroll + clientY) - 85) +'px';
       el.style.top = position;
       open_box(title);
       //close_window_when_press_escape_key($title);
       
       window.addEventListener('keydown', function (event) {
         if (event.key === 'Escape') {
             if ($("#"+title+" .active_window").is(":focus")) {
                 close_box(title);
                 r=false;
                 callback(r);
             }    
         }
       })
       $("#"+title+" #"+buttons[1]+"-button").click(function(){
          close_box(title);
          r=true;
          callback(r);
       });
       $("#"+title+" #"+buttons[0]+"-button").click(function(){
          close_box(title);
          r=false;
          callback(r);
       });
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}

function input_box($title,$type,$msg,$buttons,callback){
   var buttons = $buttons.split("&");
   var data = {title:$title,type:$type,message:$msg,buttons:$buttons};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/input_box.php",
   })
   .done( function (data) {
       if (!$("#"+$title).length) {
           $("body").append(data);
       } 
       $("#"+$title+" .active_window").draggable({ handle: "#title" });
       var el = qs("#"+title+" .active_window");
       var position = ((vscroll + clientY) - 85) +'px';
       el.style.top = position;
       open_box($title);
       $(document).ready(function(){
          $("#input_data").focus();
           window.addEventListener('keydown', function (event) {
           if (event.key === 'Escape') {
               if ($("#input_data").is(":focus")) {
                   close_box($title);
                   r=false;
                   callback(r);
               }    
           }
       })
       });
       $("#"+$title+" #"+buttons[1]+"-button").click(function(){
          input_data = qs("#input_data").value;
          close_box($title);
          r=true;
          callback(r);
       });
       $("#"+$title+" #"+buttons[0]+"-button").click(function(){
          close_box($title);
          r=false;
          callback(r);
       });
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}

function message_box($title,$type,$msg,$buttons){
   var buttons = $buttons.split("&");
   var data = {title:$title,type:$type,message:$msg,buttons:$buttons};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/message_box.php",
   })
   .done( function (data) {
       if (!$("#"+$title).length) {
           $("body").append(data);
       } 
       $("#"+$title+" .active_window").draggable({ handle: "#title" });
       var el = qs("#"+title+" .active_window");
       var position = ((vscroll + clientY) - 85) +'px';
       el.style.top = position;
       close_window_when_press_escape_key($title);
       open_box($title);
       $("#"+$title+" .active_window").focus();
       window.addEventListener('keydown', function (event) {
         if (event.key === 'Escape') {
             if ($("#"+$title+" .active_window").is(":focus")) {
                 close_box($title);
                 $("#"+$title).remove();
                 return false;
             }    
         }
       })
       $("#"+$title+" #"+buttons[0]+"-button").click(function(){
          close_box($title);
          $("#"+$title).remove();
          return false;
       });
       return r;
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}

function alert_box($title,$type,$msg,$buttons){
   var buttons = $buttons.split("&");
   var data = {title:$title,type:$type,message:$msg,buttons:$buttons};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/alert_box.php",
   })
   .done( function (data) {
       if (!$("#"+$title).length) {
           $("body").append(data);
       } 
       $("#"+$title+" .active_window").draggable({ handle: "#title" });
       var el = qs("#"+title+" .active_window");
       var position = ((vscroll + clientY) - 85) +'px';
       el.style.top = position;
       open_box($title);
       $("#"+$title+" #"+buttons[0]+"-button").click(function(){
          close_box($title);
          $("#"+$title).remove();
          return false;
       });
       return r;
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}

function note_box($title,$style,$msg,$buttons,callback){
   var buttons = $buttons.split("&");
   var data = {title:$title,style:$style,message:$msg,buttons:$buttons};
   var data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"libraries/windows/note_box.php",
   })
   .done( function (data) {
       if (!$("#"+$title).length) {
           $("body").append(data);
       } 
       $("#"+$title+" .active_window").draggable({ handle: "#title" });
       var el = qs("#"+title+" .active_window");
       var position = ((vscroll + clientY) - 85) +'px';
       el.style.top = position;
       open_box($title);
       //qs("#input_note").focus();
       close_window_when_press_escape_key($title);
       $("#"+$title+" #"+buttons[1]+"-button").click(function(){
          inpute_note = qs("#input_note").value;
          close_box($title);
          r=true;
          callback(r);
       });
       $("#"+$title+" #"+buttons[0]+"-button").click(function(){
          close_box($title);
          r=false;
          callback(r);
       });
   })
   .fail( function (jqXHR, textStatus, errorThrown) {

   });
}