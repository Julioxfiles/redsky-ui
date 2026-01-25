//document.oncontextmenu = function(){return false;}

//import { businessCard } from "../components/businessCard.js";
//businessCard = require('../components/businessCard.js');

var lastKnownScrollPosition = 0;
var viewport_height = window.innerHeight;

document.addEventListener("scroll", (event) => {
   lastKnownScrollPosition = window.scrollY;
   //console.log(lastKnownScrollPosition);

   var viewport_height = window.innerHeight;
   var viewport_client_height = document.documentElement.clientHeight;
   var full_window_height = window.outerHeight;
 
   //console.log("vp_height",viewport_height);
   //console.log("vp_client_height",viewport_height);
   //console.log("full_win_height",viewport_height);
   
});

var offsetX = 0; var offsetY = 0;
var clientX = 0; var clientY = 0;
window.addEventListener("click", (event) => {
   offsetX = event.offsetX;
   offsetY = event.offsetY;   
   clientX = event.clientX;
   clientY = event.clientY;   
   //console.log("offsetY",offsetY);
   //console.log("clientY",clientY);
});

var vscroll = 0;
window.addEventListener('scroll', function(){
   vscroll = this.scrollY;
});

var r=true;

// Mapa google
var contador=0;
var active = true;
var mapa = null;
var marker = null;
var circle = null;
var currentPosition = null;
var latitude=0;
var longitude=0;
var altitude=0;



function new_window(){
  var new_page=window.location.href;
  //alert( new_page);
  window.open( new_page,'_blank');
}

// Esta funcion permite hacer un querySelector y retornar el objeto
function qs(selector) {
   var d = document;
   return d.querySelector(selector);
}

// Esta funcion permite hacer un getElementById y retornar el objeto
function id(selector) {
   var d = document;
   return d.getElementById(selector);
}

// Esta funcion permite hacer un getElementById y retornar el objeto
function gebid(selector) {
   var d = document;
   return d.getElementById(selector);
}

function clickAcceptButton() {
   document.getElementById("Accept-button").click();
}

function toggle_check_i_aggre(){
    if ($("#sign-up-btn").hasClass("hidden")){
        $("#sign-up-btn").removeClass("hidden").addClass("show");
        qs("#i-agree-btn").checked = true;
    }else{
        $("#sign-up-btn").removeClass("show").addClass("hidden");        
        qs("#i-agree-btn").checked = false;
    }
}

function activa_la_informacion(product_id){
  if ( $('#info'+product_id.id).hasClass('informacion_inactiva')){
       $('#info'+product_id.id).removeClass('informacion_inactiva');
       $('#info'+product_id.id).addClass('informacion_activa');
       $('#info'+product_id.id).css("opacity","1.0");
  }else{
       $('body').css("opacity","1.0");
       $('#info'+product_id.id).removeClass('informacion_activa');
       $('#info'+product_id.id).addClass('informacion_inactiva');
  }
}

function cierra_la_informacion(product_id){
   $('body').css("opacity","1.0");
   $('#info'+product_id.id).removeClass('informacion_activa');
   $('#info'+product_id.id).addClass('informacion_inactiva');
}

function activa_la_nota( i){
  if ( $('#nota'+ i).hasClass('nota_inactiva')){
       $('#nota'+ i).removeClass('nota_inactiva');
       $('#nota'+ i).addClass('nota_activa');
       $('#nota'+ i).css("opacity","1");
  }else{
       $('#nota'+ i).removeClass('nota_activa');
       $('#nota'+ i).addClass('nota_inactiva');
  }
}

function cierra_la_nota( i){
   $('body').css("opacity","1.0");
   $('#nota'+ i).removeClass('nota_activa');
   $('#nota'+ i).addClass('nota_inactiva');
}

function actualiza_color(){
  var color = qs("#id_Color").options[qs("#id_Color").selectedIndex].text;
   qs("#Color").value =  color;
}

function close_message_box( TitleMessageBox){
   ( TitleMessageBox).hide();
}

function close_input_box( Titulo){
   ( Titulo).hide();
}

function close_alert_box( Titulo){
   ( Titulo).hide();
}

function initMap( Latitud, Longitud){
   Latitud=parseFloat( Latitud);
   Longitud=parseFloat( Longitud);
  var opciones={
      center: new google.maps.LatLng( Latitud, Longitud),
      zoom:15,
      MapTypeid: google.maps.MapTypeid.ROADMAP
  }
  var mapa = document.getElementById('mi-mapa');
  mapa= new google.maps.Map(mapa,opciones);
  var marcador= new google.maps.Marker({
      position:{lat: Latitud,lng: Longitud},
      map:mapa
  });
}

function getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(get_position);
}

function get_position(position){
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
   altitude = position.coords.altitude;
   qs("#latitude").value = latitude;
   qs("#longitude").value = longitude;   
}

function set_position( lat, lon, alt){
    latitude = lat;
    longitude = lon;
    //altitude = alt;
}

var geooptions = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
};

function geoError(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

function getUserCurrentPosition(handler_function){
   //console.log("getUserCurrentPosition");
   if (navigator.onLine) {
      // el navegador está conectado a la red
   } else {
      alert_box("Alert","Alert","Check internet conexion.","Accept"); return false;
   }
   PositionID = navigator.geolocation.getCurrentPosition(handler_function,geoError,geooptions);
}

function getUserWatchPosition(handler_function){
   //console.log("getUserCurrentPosition");
   if(navigator.onLine) {
      // el navegador está conectado a la red
    } else {
      alert_box("Alert","Alert","Check internet conexion.","Accept"); return false;
    }
    PositionID = navigator.geolocation.watchPosition(handler_function,geoError,geooptions);
}

function geolocation_search(position){
   var search = qs("#search").value;
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
   // altitude=position.coords.altitude;
   //alert( latitude+" "+ longitude+" "+ altitude);
   var food_id = qs("#food_id").innerHTML;
   var m ="geolocation_search";
   var data = {m,food_id,latitude,longitude,search};
   data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"controllers/businessesController.php",
       beforeSend: function(){
          //message_box("Wait","Geolocation","Processiog...please wait.","Close","Accept");
       },
       success: function(res){
          close_box("Wait");
          res = JSON.parse(res);
          if ( res.result == "No records were found.") {
              qs("#businesses").innerHTML =  res.result;
              return false;
          }
          //ssconsole.log( response);
          //console.log(res.result[0].food);
          let html = '';
          if ( search == "") {
              foods =  res.result;
              console.log(foods);
              //let obj = {food:"Hola",imagen:"mi.jpg"};
              //Object.entries(obj).forEach(el => console.log(el));
              Object.entries(foods).forEach(el =>  html += foodCard(el) );
              //console.log("foods:",foods);  Aqui se muestran las foods
          }else{   
              foods =  res.result;
              branches = []; i=0;
              Object.values(foods).forEach(food => {
                 //console.log("food:",food);
                 Object.values(food.businesses).forEach(business => {
                    //console.log("business:",business);
                    Object.values(business.branches).forEach(branch => {
                       branches[i] = branch ;
                       i++;
                       //console.log("branches:",branches);
                    });   
                 });   
              });
              Object.entries(branches).forEach(el =>  html += branchCard(el) );
          }    
          qs("#businesses").innerHTML = html ;

       },
       error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
   });
}

function searchByCategories(){
   //console.log("searchByCategories");
   qs("#search").value = "";
   getUserCurrentPosition(geolocation_search);
}

function stopTrackMe(){
   input_box("password","password","Supervisor password.","Close&Accept",function(){
      if (r){
           pass = input_data;
           password = "admin";
          if ( pass ==  password ){
             //clearInterval(traking)
             navigator.geolocation.clearWatch(PositionID);
             var html = "<span style='color:#86B7FE;font-size:14px'> Traking has stop.</span><br/>";
             const div = qs("#businesses").innerHTML =  html;
             history.back();
          }
      }
   });
}

function updateMyPosition() {
   navigator.geolocation.getCurrentPosition(function (position) {
       var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
       console.log(myLatLng);
       //saveCurrentUserPosition();
       var updatePos = setTimeout(updateMyPosition, 5000);
   });
}

function saveCurrentUserPosition(position){
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    myLatLng = {lat: lat, lng: lng};
    console.log("saveCurrentUserPosition:",myLatLng);
     date = date();
    var html = "<a href='https://maps.google.com/maps?q="+lat+","+lng+"' target='_blank' style='color:#86B7FE;font-size:14px'>"+ date+" "+lat+", "+lng+"</a><br/>";
    const div = qs("#locations").innerHTML +=  html;
    var data = {latitude:lat,longitude:lng};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"controllers/saveCurrentUserPosition.php",
        beforeSend: function(){
           //message_box("Wait","Geolocation","Processiog...please wait.","Close","Accept");
        },
        success: function(res){
            res = JSON.parse(res);
           if ( res.result == "success") {
               return true;
           }
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
         }
    });
}

function retrieveCurrentUserPosition( user_id, callback) {
    var data = {user_id};
     // The user_id may also be the deliverier_id
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"controllers/retrieveCurrentUserPosition.php",
        beforeSend: function(){
           //message_box("Wait","Geolocation","Processiog...please wait.","Close","Accept");
        },
        success: function(res){
           res = JSON.parse(response);
           //alert(res.lat+" - "+res.lng);
           if (res.status == "success") {
               myLatLng = {lat:parseFloat(res.lat),lng:parseFloat(res.lng)};
               console.log(myLatLng)
               callback(myLatLng);
           }else{
               confirm_box("Info","Info",res.result,"Accept","",function(){
                  if (!r){
                     history.back();
                  }
               });
           }
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
         }
    });
}

function foodCard (props) {
   //console.log(props[1].food);
   //let {food_image,food,food_description} = props;
   return `
   <div class='card' style='height:90px;${bg_card};border:solid 1px ${border};max-width:400px' id='${props[1].food_id}' onclick='getBusinesses(this.id)'>
      <img class='card-img-left' src='./images/${props[1].food_image}' height='90px' width='100px'>
      <div class='card-body' style='margin-left:100px;margin-top:-90px;width:100%'>
         <h4 class='card-title' style='color:${primary};'><b>${props[1].food}</b></h4>
         <p class='card-text' style='color:${secondary};'>${props[1].food_description}</p>
      </div>
   </div>`   
}

function getBusinesses (id) {
   food_id = id ;
   qs("#food_id").innerHTML =  food_id;
   //console.log("foods:",foods);
   Object.entries(foods).find(function (el,index) { 
      if ( foods[index].food_id === parseInt( food_id) ) {
           businesses = foods[index].businesses; 
           let  html = '';
           Object.entries(businesses).forEach(el => html += businessCard(el) );
           qs("#businesses").innerHTML = html ;
      }  
   });
   return false;
  
}

function businessCard (props) {
   return `
   <div class='card' style='height:90px;${bg_card};border:solid 1px ${border};max-width:400px' id='${props[1].business_id}' onclick='getBranches(this.id)'>
      <img class='card-img-left' src='./businesses/${props[1].business_id}/images/business/${props[1].business_image}' height='90px' width='100px'>
      <div class='card-body' style='margin-left:100px;margin-top:-90px;width:100%'>
         <h4 class='card-title' style='color:${primary};'><b>${props[1].business}</b></h4>
         <p class='card-text' style='color:${secondary};'>${props[1].business_description}</p>
      </div>      
   </div>`   
}

function getBranches (id) {
   business_id = id;
   qs("#business_id").innerHTML =  business_id;
   console.log(business_id);
   Object.entries(businesses).find(function (el,index) { 
      if ( businesses[index].business_id === business_id ) {
           branches = businesses[index].branches; 
           let  html = '';
           Object.entries(branches).forEach(el =>  html += branchCard(el) );
           qs("#businesses").innerHTML = html ;
      }  
   });
}

function branchCard (props) {
    //console.log(props[1].food);
    //let {food_image,food,food_description} = props;
    var food_id = props[1].food_id;
    var business_id = props[1].business_id;
    var branch_id = props[1].branch_id;
    var data = "food_id="+food_id+"&business_id="+business_id+"&branch_id="+branch_id+"&service_type_id=1";
    data = window.btoa( data);
    //location.href="monitor.php?&s="+ data;
    //
    //onclick='onBranchSelected( {food_id}, {business_id},this.id,)'
    return `
    <a href='new_or_monitor.php?&s=${data}'>
     <div class='card' style='height:90px;${bg_card};border:solid 1px ${border};max-width:400px' id='${props[1].branch_id}' >
       <img class='card-img-left' src='./businesses/${business_id}/images/branches/${props[1].image}' height='90px' width='100px'>
       <div class='card-body' style='margin-left:100px;margin-top:-90px;width:100%'>
          <h4 class='card-title' style='color:${primary};'><b>${props[1].branch}</b></h4>
          <p class='card-text' style='color:${link};'>${props[1].address}</p>
       </div>      
     </div>
    </a>`
    // <a href='tel: {props[1].phone}'> <p class='card-text' style='color: { link};'> Llamar:  {props[1].phone} </p> </a>
 }

 function onBranchSelected( food_id, business_id, branch_id){
   qs("#food_id").innerHTML =  food_id;  
   qs("#business_id").innerHTML =  business_id;   
   qs("#branch_id").innerHTML =  branch_id;  
   add_new_order(2,0);
 }

function getExternalDeliverierCurrentPosition(){
    navigator.geolocation.getCurrentPosition(view_available_external_deliveries);
}

function view_available_external_deliveries(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    //alert( latitude+" "+ longitude+" "+ altitude);
    var data = {latitude: latitude,longitude: longitude};
    data = JSON.stringify(data);
    $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"views/external_deliveries/view_available_external_deliveries.php",
       beforeSend: function(){
          //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
       },
       success: function(res){
          close_box("Wait");
          qs("#availables #window_content").innerHTML = res;
          //location.reload();
       },
       error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
       }
     });
}

function write_position( Latitud, Longitud, Altitud){
   qs("#latitude").val( Latitud);
   qs("#longitude").val( Longitud);
   qs("#altitude").val( Altitud);
}

function show_position(position){
    var Ubicacion = qs("#Ubicacion");
    var Latitud=position.coords.latitude;
    var Longitud=position.coords.longitude;
    var Altitud=position.coords.altitude;
     Ubicacion =  Latitud+"<br/>"+ Longitud+"<br/>"+ Exactitud+"<br/>";
    qs("#Ubicacion").innerHTML = Ubicacion;
}

function saltar(e, id){
  // Obtenemos la tecla pulsada
  (e.keycode)?k=e.keycode:k=e.which;
  // Si la tecla pulsada es enter (en codigo ascii 13 es un enter)
  if(k==13){
     // Nos positionamos en el siguiente input
      (id).focus();
  }
}

function buscar_informacion_de_envio(e, phone){
  // Obtenemos la tecla pulsada
  (e.keycode)?k=e.keycode:k=e.which;
  // Si la tecla pulsada es enter (en codigo ascii el 13 es un enter)
  if(k==13){
     // Se llama a la siguiente funcion para traer la informacion de envio
     trae_informacion_de_envio( phone);
  }
}

function focus_in(id){
   qs("#"+id).focus();
}

function notificacion( titulo, mensaje, id){
  if (Notification){
     if (Notification.permission!=="granted"){
         Notification.requestPermission()
     }
     var opciones = {
       icon: "images/lat24logo.png",
       body:  mensaje,
     }
     var song = "notification.mp3";
     new Audio(song).play();
     var noti = new Notification( titulo, opciones);
     noti.onclick=function(e){
       e.preventDefault();
       var business_id = qs("#business_id").innerHTML;
       var branch_id = qs("#branch_id").innerHTML;
       //window.open("monitor.php?business_id="+ business_id+"&branch_id="+ branch_id,"_self");
       noti.close();
       set_notification_as_seen( id);
     }
     noti.onclose=function(e){
       e.preventDefault();
       set_notification_as_seen( id);
       noti.close();
     }
     //setTimeout( function() { noti.close(); }, 10000)
  }
}

function check_for_new_orders(){
    var business_id = qs("#business_id").innerHTML;
    var branch_id = qs("#branch_id").innerHTML;
    //alert( business_id+" "+ branch_id);
    var data = {business_id,branch_id};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"controllers/check_for_new_orders.php",
        beforeSend: function(){
      },
      success: function(res) {
        var response = JSON.parse(res);
        if (res.status == "success") {
           var id = res.id;
           var order_id = res.order_id;
           notificacion("La orden #"+ order_id+" ha arrivado","Haga click aqui si ya esta enterado.", id);
        }
      },
      error: function(jqXHR,textstatus,errorThrown){
         qs("#resultado").innerHTML = "Error:" + errorThrown;
      }
    });
}

function set_notification_as_seen( id){
    var business_id = qs("#business_id").innerHTML;
    var branch_id = qs("#branch_id").innerHTML;
    var data = {business_id,branch_id,id};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"set_notification_as_seen.php",
        beforeSend: function(){
      },
      success: function(res){
      },
      error: function(jqXHR,textstatus,errorThrown){
         qs("#resultado").innerHTML = "Error:" + errorThrown;
      }
    });
}

function toggle_section( id){
   if ($("#section-"+ id).hasClass("hidden")){
       $("#section-"+ id).slideUp();
       $("#section-"+ id).removeClass("hidden").addClass("show");
       qs("#img-"+ id).setAttribute("src","images/icon_arrow_up_green.png");
   }else{
       $("#section-"+ id).slideDown();
       $("#section-"+ id).removeClass("show").addClass("hidden");
       qs("#img-"+ id).setAttribute("src","images/icon_arrow_down_green.png");
   }
}

function toggle_help_section( id){
   //alert( id);
   // (".section").toggleClass('hide');
   if ($("#section-"+ id).hasClass("hidden")){
       $("#section-"+ id).slideUp();
       $("#section-"+ id).removeClass("hidden").addClass("show");
       $("#img-"+ id).setAttribute("src","images/icon_minus_pngimg.png");
   }else{
       $("#section-"+ id).slideDown();
       $("#section-"+ id).removeClass("show").addClass("hidden");
       $("#img-"+ id).setAttribute("src","images/icon_help.png");
   }
}

function toggle( id, name){
   if ($("#"+ name.id).hasClass("hidden")){
       $("#"+ name.id).removeClass("hidden").addClass("show");
   }else{
       $("#"+ name.id).removeClass("show").addClass("hidden");
   }
}

function get_ids_values( data){

}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function my_user_info(id){
   var data = {id};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"my_user_info.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
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
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function save_my_user_info(){
   // General data
   let form_id = "#form_users";
   let form = qs(form_id);
   // Get all field data from the form
   let data = new FormData(form);
   data.append('m','save'); 
   let obj = {};
   obj = serialize(data);
   //console.log(obj);
   
   // Validating data
   if (obj.name == "") {
      input_error(form_id+" #name","Este campo es requerido.");
      return false;
   }
   
   if (obj.phone == ''){
      confirm_box("Alert","Alert","You must enter a phone","Accept","",function(){
        input_error(form_id+" #phone","Este campo es requerido.");
      });
      return false;
   }

   data = JSON.stringify(obj);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/save_my_user_infoController.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait","Close");
      },
      success: function(res){
         close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
            close_window("#User");
            confirm_box("Success","Success","Data was saved successfully.","Accept","",function(r){
              if (!r) {
                location.reload();
              }
            });
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
        close_box("Wait");
        alert_box("Error","Error","An internal error has occurred.","Accept");
      }
   });
}

function save_my_password(){
   var new_password = qs("#new_password").value;
   var confirm_password = qs("#confirm_password").value;
   if (new_password == ''){ alert_box("Error","Error","You must enter the current password to proceed.","Accept"); return false; }
   if (new_password.length < 6){ alert_box("Error","Error","You must enter a length password at least 6 characters.","Accept"); return false; }
   if (confirm_password != new_password){ alert_box("Error","Error","The New password and the password Confirmation does not match.","Accept"); return false; }
   
   var data = {new_password};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/save_my_password.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
            close_box("password");
            confirm_box("Success","Success","Data was saved successfully.","Accept","",function(){
                //window.location.reload();
            });
         }else{
            alert_box("Error","Error","data was not save.","Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function my_password( id){
   //qs("#toggle_menu").click();
   $.ajax({
      type:"POST",
      datatype:"json",
      url:"my_password.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
          style="z-index:2;width:auto;max-width:500px;height:100%;max-height:100%;top:0%;";
         window_pop("password",style,function(){
            if (r){
               qs("#password #window_content").innerHTML = res;    
            }   
         });
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function save_my_language(){
   var language = qs("#language").value;
   var data= {language};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/save_my_language.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
            close_box("language");
            confirm_box("Success","Success","Data was saved successfully.","Accept","",function(r){
              if (!r) {
                location.reload();
              }
            });
         }else{
            alert_box("Error","Error","Data was not save.","Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function my_language(){
   //qs("#toggle_menu").click();
   $.ajax({
      type:"POST",
      datatype:"json",
      //data:{"data":data},
      url:"my_language.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
          style="z-index:2;width:auto;max-width:500px;height:100%;max-height:100%;top:0%;";
         window_pop("language",style,function(){
            if (r){
               qs("#language #window_content").innerHTML = res;    
            }   
         });
      },
      error: function(jqXHR,textstatus,errorThrown){
         alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function my_theme(){
    theme = qs("#theme").value;
   //console.log( theme);
   if ( theme === "light") {
       theme = "dark" ;
   } else if ( theme === "dark") {
       theme = "dark-green" ;
   } else if ( theme === "dark-green") {
       theme = "light";
   }      
    data={theme: theme};
   var data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/save_my_theme.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
            //confirm_box("Success","Success","Data was saved successfully.","Accept","",function(){
                window.location.reload();
            //});
         }else{
            alert_box("Error","Error","data was not save.","Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
   
}

function choose( url){
      /*var order_payed = qs("#order_payed").innerHTML; 
      if ( order_payed == "on"){ 
         alert_box("payed","Error","Cancel the account payment before to make any changes.","Accept");
         return false;
      }*/

      if ( url == "waiter.php"){
         var can_assign_a_waiter_to_an_order = qs("#can_assign_a_waiter_to_an_order").innerHTML;
         if ( can_assign_a_waiter_to_an_order=="false"){
             alert_box("permissions","Info","You do not have waiter assignment permissions.","Accept"); return false;
         }
      }
      if ( url == "chef.php"){
         var can_assign_a_chef_to_an_order = qs("#can_assign_a_chef_to_an_order").innerHTML;
         if ( can_assign_a_chef_to_an_order=="false"){
            alert_box("permissions","Info","You do not have chef assignment permissions.","Accept"); return false;
         }
      }
      if ( url == "deliverier.php"){
         var delivery_type_id = qs("#delivery_type_id").innerHTML;
         if ( delivery_type_id=="2"){
             alert_box("External","Info","The order is in external delivery.","Accept"); return false;
         }
         /*var can_asing_a_delivery_guy_to_an_order = qs("#can_asing_a_delivery_guy_to_an_order").innerHTML;
         if ( can_asing_a_delivery_guy_to_an_order=="false"){
             alert_box("permissions","Info","You do not have deliverier assignment permissions.","Accept"); return false;
         }*/
      }
       $.getScript("js/get_order_main_data.js", function() {
          data={business_id,branch_id,folio_id,order_id: order_id};
         var data = JSON.stringify(data);
         $.ajax({
            type:"POST",
            datatype:"json",
            data:{"data":data},
            url: url,
            beforeSend: function(){
               //message_box("Wait","Wait","Processing...please wait.","Close");
            },
            success: function(res){
               //close_box("Wait");
               // style="width:100%;max-width:500px;height:100%;top:0%;Left:0%;overflow-x:hidden;overflow-y:hidden;";
               style="z-index:2;width:auto;max-width:500px;";
               window_pop("Choose",style,function(){
                  if (r){
                      qs("#Choose #window_content").innerHTML = res;    
                  }   
               });
            },
            error: function(jqXHR,textstatus,errorThrown){
               close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
            }
         });
      });

}

function assign( url, id){
  if ( url == 1){
       url = "assign_waiter.php";
  }else if ( url == 2){
       url="assign_chef.php";
  }else if ( url == 3){
       url = "assign_deliverier.php";
  }
  $.getScript("js/get_order_main_data.js", function() {
    id = id.slice(5);  // le quita "card-""
    data = {business_id,branch_id,folio_id,order_id,id};
    var data = JSON.stringify(data);
    //alert( dataCuenta);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url: url,
        beforeSend: function(){
           //message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
           close_box("Wait");
           close_window("#Choose");
           var res = JSON.parse(res);
           if (res.status == "success") {
               //window.location.reload();
           }else{
               alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
           }
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
  });
}

function can_not_make_any_changes(){
    //alert_box("Changes","Info","You can not make any changes.Try calling the branch.","Accept");return false;
    alert_box("Monitor","Info","You can monitor the delivery when the button changes to red.","Accept");return false;
}

function deny_reason_windows(){
    if (at_least_one_account_is_payed()){ alert_box("payed","Error","At least one account is payed.","Accept"); return false; }
    var can_edit_an_order = qs("#can_edit_an_order").innerHTML;
    if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
    var can_deny_an_order = qs("#can_deny_an_order").innerHTML;
    if ( can_deny_an_order == false){
       alert_box("permissions","Info","You do not have denial permits.","Accept");
       return false;
    }
    input_box("Deny","Input","Why are you denying ?","Cancel&Accept",function(){
        if (r){
           deny_order();
        }
    });
}

function deny_order(){
   $.getScript("js/get_order_main_data.js", function() {
    var order_status_id = qs("#order_status_id").innerHTML;
    var can_edit_an_order = qs("#can_edit_an_order").innerHTML;
    if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
    var id = qs("#id").innerHTML;
    // input_data es lo que el users entra en el input_box
    deny_reason = input_data;
    var data = {id,business_id,deny_reason};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:'controllers/deny_order.php',
        beforeSend: function(){
           message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
          close_box("Wait");
          var res = JSON.parse(res);
          if (res.status == "success") {
              window.location.reload();
          }else{
              alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
          }
        },
        error: function(jqXHR,textstatus,errorThrown){
           alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
  });
}

function set_order_status_cancelled( folio_id) {
  
  if (!can_cancel_order()) { 
    alert_box("permissions","Info","You do not have permissions to cancell.","Accept");
    return false; 
  } 

  var delivery_type_id = qs("#delivery_type_id").innerHTML; 
  if ( delivery_type_id == 2){
    alert_box("Info","Info","The order is in external delivery.","Accept"); 
    return false;
  }

  if (order_is_payed(order_id)){ 
   alert_box("Info","Info","The order has been payed and can not be cancelled.","Accept"); 
   return false;
  }

  if (is_being_delivered()) {
   alert_box("Info","Info","The order is being delivered.","Accept");
   return false;
  }

  if (!can_edit_order()){
   alert_box("permissions","Info","You do not have editing permits.","Accept");
   return false;
  }

  confirm_box("Cancel","Error","Do you want to cancel the order ?","No&Yes","",function(){
      if (r) {
         if (at_least_one_account_is_payed()){ alert_box("payed","Error","At least one account is payed.","Accept"); return false; }
          $.getScript("js/get_order_main_data.js", function() {
            
            var id = qs("#id").innerHTML;
            // input_data es lo que el users entra en el input_box
            deny_reason = input_data;
            var data = {id,business_id,deny_reason};
            data = JSON.stringify(data);            
            $.ajax({
               type:"POST",
               datatype:"json",
               data:{"data":data},
               url:'controllers/set_order_status_cancelled.php',
               beforeSend: function(){
                  //message_box("Wait","Wait","Processing...please wait.","Close");
               },
               success: function(res){
                  close_box("Wait");
                  var res = JSON.parse(res);
                  if (res.status == "success") {
                     window.location.reload();
                  }else{
                     alert_box("Info","Info",res.status,"Accept"); return false;
                  }
               },
               error: function(jqXHR,textstatus,errorThrown){
                  close_box("Wait"); alert_box("Info","Info","An internal error has occurred.","Accept"); return false;
               }
            });
         });
          
      }
  });
  
}

function set_order_status_requested( folio_id){
   $.getScript("js/get_order_main_data.js", function() {
    var order_status_id = qs("#order_status_id").innerHTML;
    var can_edit_an_order = qs("#can_edit_an_order").innerHTML;
    if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
    var id = qs("#id").innerHTML;
    // input_data es lo que el users entra en el input_box
    deny_reason = input_data;
    var data = {id,business_id,deny_reason};
    data = JSON.stringify(data);
    //alert( dataCuenta);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:'controllers/set_order_status_requested.php',
        beforeSend: function(){
           //message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
          //close_box("Wait");
          var res = JSON.parse(res);
          if (res.status == "success") {
              window.location.reload();
          }else{
              alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
          }
        },
        error: function(jqXHR,textstatus,errorThrown){
           alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
  });
}

function set_order_status_working(){
   $.getScript("js/get_order_main_data.js", function() {
     var order_status_id = qs("#order_status_id").innerHTML;
     var can_edit_an_order = qs("#can_edit_an_order").innerHTML;
     if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
     var id = qs("#id").innerHTML;

     var data = {id,business_id};
     data = JSON.stringify(data);

     $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:'controllers/set_order_status_working.php',
        beforeSend: function(){
           message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
           close_box("Wait");
           var res = JSON.parse(res);
           if (res.status == "success") {
              window.location.reload();
           }else{
              alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
           }
        },
        error: function(jqXHR,textstatus,errorThrown){
           alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
  });
}

function set_order_status_done(){
   $.getScript("js/get_order_main_data.js", function() {
     var order_status_id = qs("#order_status_id").innerHTML;
     var can_edit_an_order = qs("#can_edit_an_order").innerHTML;
     if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
     var id = qs("#id").innerHTML;

     var data = {id,business_id};
     data = JSON.stringify(data);

     $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:'controllers/set_order_status_done.php',
        beforeSend: function(){
           message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
           close_box("Wait");
           var res = JSON.parse(res);
           if (res.status == "success") {
              window.location.reload();
           }else{
              alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
           }
        },
        error: function(jqXHR,textstatus,errorThrown){
           alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
  });
}

function set_order_status_delivering(){
  // $.getScript("js/get_order_main_data.js", function() {
     //var order_status_id = qs("#order_status_id").innerHTML;
     //var can_edit_an_order = qs("#can_edit_an_order").innerHTML; if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
     var folio_id = qs("#folio_id").innerHTML;
     var data = {folio_id};
     data = JSON.stringify(data);
     $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:'controllers/set_order_status_delivering.php',
        beforeSend: function(){
           //message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
           close_box("Deliver");
           var res = JSON.parse(res);
           if (res.status == "success") {
               // on_my_way=true;
               /*
                get_coordinates = setInterval(function(){
                   getDeliverierLocation();
               },10000);
               qs("#set_status_delivering").remove();
               alert_box("Delivering","Info","Your customer monitor you. Do not close the notebook until deliver.","Accept");
               */
           }else{
               alert_box("Info","Info",res.status,"Accept"); return false;
           }
           //window.location.reload();
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
  //});
}

function set_order_status_delivered(){
    var delivery_type_id = qs("#delivery_type_id").innerHTML;
    if ( delivery_type_id==2){ alert_box("Info","Info","The order is in external delivery.","Accept"); return false; }
    
    var request_end_delivery_code = qs("request_end_delivery_code").innerHTML;

    if ( request_end_delivery_code=="on"){
        input_box("code","Input","Enter end delivery code","Close&Accept",function(){
             if (r){
                //alert(input_data);
                var code=input_data;
                if ( code.length != 4){
                    alert_box("Alert","Alert","The code must be 4 digits long.","Accept"); return false;
                }else{
                    var business_id = qs("#business_id").innerHTML;
                    var branch_id = qs("#branch_id").innerHTML;
                    var folio_id = qs("#folio_id").innerHTML;
                    //alert( business_id+" "+ branch_id+" "+ folio_id);
                    finish_delivery_with_end_delivery_code( business_id, branch_id, folio_id, code);
                }
             }
        });
    }else{
        var encoded="off";
        confirm_set_order_status_delivered_now( encoded);
    }
}

function confirm_set_order_status_delivered_now( encoded){
    var can_edit_an_order = qs("#can_edit_an_order").innerHTML; if (can_edit_an_order == false ){ alert_box("permissions","Info","You do not have editing permits.","Accept");return false; }
    confirm_box("Delivered","Question","Have you already delivered the order ?","No&Yes","",function(){
         if (r){
            set_order_status_delivered_now( encoded);
         }
    });
}

function set_order_status_delivered_now( encoded){
    var id = qs("#id").innerHTML;
    var business_id = qs("#business_id").innerHTML;
    var data = {id,business_id,encoded};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:'controllers/set_order_status_delivered.php',
        beforeSend: function(){
          //message_box("Wait","Wait","Processing...please wait.","Close");
        },
        success: function(res){
           close_box("Wait");
           var res = JSON.parse(res);
           if (res.status == "success") {
               window.location.reload();
               clearInterval(get_coordinates);
           }else{
               alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
           }
         },
         error: function(jqXHR,textstatus,errorThrown){
            close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
         }
     });
}

function pause_branch_online_sale( branch_id){
    var data = {branch_id};
    data = JSON.stringify(data);
    $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/pause_branch_online_sale.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
            //message_box("Info","Info","You have pause this branch online sale successfuly.","Accept");
            confirm_box("Disabled","Alert","Your online customers will not be able to order.","Accept","",function(){
               location.reload();
            });
         }else{
            alert_box("Error","Error","The pause could not be applied.","Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
    });
}

function play_branch_online_sale( branch_id ){
    var data = {branch_id};
    data = JSON.stringify(data);
    $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/play_branch_online_sale.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
             confirm_box("Enabled","Success","Your online customers will be able to order.","Accept","",function(){
                location.reload();
             });
         }else{
             alert_box("Error","Error","The play could not be applied.","Accept"); return false;
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
    });
}

function drawMap( latitude, longitude){
   var date = new Date();
   var hour = date.getHours();
   var minutes = date.getMinutes();
   var seconds = date.getSeconds();
   var datetime = hour+':'+minutes+':'+seconds;
   // ('#log').append('<div>Geolocation - '+Active+' ('+datetime+' '+currentPosition+')</div>');
   var mapoptions = {
       center: new google.maps.LatLng( latitude, longitude),
       zoom: 17,
       disableDoubleClickZoom: false,
       disableDefaultUI: true,
       zoomControl: false,
       mapTypeControl: false,
       zoomControloptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.TOP_LEFT
       },
       mapTypeid: google.maps.MapTypeid.ROADMAP
       };
       mapa = new google.maps.Map(document.getElementById('map_canvas'), mapoptions);
       marker = new google.maps.Marker({
          title: 'Hello mundo :D',
          map: mapa,
       });
       // Al marcador (el globito rojo) se le asigna la position actual (currentPosition).
       marker.setPosition(currentPosition);
       marker.setvisible(true);
       circle = new google.maps.Circle({
           map: mapa,
           radius: 50,
           strokeWeight: 0,
           strokePosition: google.maps.StrokePosition.CENTER,
           fillColor: '#137900'
   });
   circle.bindTo('center', marker, 'position');
   circle.setvisible(true);
}

function search_empresa(){
    var food_id = qs("#food_id").innerHTML;
    var search = qs("#search").value;
    var data = {m:"search",category_id,search};
    data = JSON.stringify(data);
    $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"controllers/businessesController.php",
       beforeSend: function(){
          //message_box("Wait","Wait","Processiog...please wait.","Close");
       },
       success: function(res){
          close_box("Wait");
          qs("#empresas").innerHTML = res;
          //location.reload();
       },
       error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
       }
    });
}

function date(){
  var date = new Date();
  var date_string =  date.getFullYear() + "-"+ ("0"+( date.getMonth()+1)).slice(-2) + "-" + ("0" +  date.getDate() ).slice(-2) + " " + ("0" +  date.getHours() ).slice(-2) + ":" + ("0" +  date.getMinutes() ).slice(-2) + ":" + ("0" +  date.getSeconds() ).slice(-2) ;
  return  date_string;
}

function validate_email(email){
    //var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+ /;
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+ /;
    if (!regex.test(email)) {
        return false;
    }
    return true;
 }


/*
function validate_email(emails) {
    //var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})) /;
    var filter = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})) /;
    if (!filter.test( String(email).toLowerCase())) {
        return false;
    }
    return true;
}*/

function validate_emails(string) {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})? /;
    var result = string.replace(/\s/g, "").split(/,|;/);
    for (var i = 0;i < result.length;i++) {
        if (!regex.test(result[i])) {
           return false;
        }
    }
    return true;
}

function load_states( country_id, id_state){
   //alert_box("Alert","Info", clave,"Accept");
   var data = {country_id};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/load_states.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         //close_box("Wait");
         qs("#"+ id_state).innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
         alert_box("Error","Error",textstatus+" "+errorThrown,"Accept");    
      }
   });
}

function load_cities( state_id, city_id ){
  //alert_box("Alert","Info", clave,"Accept");
   var data = {state_id};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/load_cities.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         //close_box("Wait");
         qs("#"+ city_id).innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
         message_box("Error","show");
      }
   });
}

function load_branches( business_id, branch_id ){
   //alert_box("Alert","Info", business_id,"Accept");
   var data = {business_id};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/load_branches.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         //close_box("Wait");
         qs("#"+ branch_id).innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
         message_box("Error","show");
      }
   });
}

function load_registers( branch_id, register_id ){
   //alert_box("Alert","Info", branch_id,"Accept");
   var data = {branch_id};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/load_registers.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         //close_box("Wait");
         qs("#"+ register_id).innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
         message_box("Error","show");
      }
   });
}

function load_sub_categories( category_id,sub_category_id ){
   //alert_box("Alert","Info", clave,"Accept");
   var data = {category_id};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"load_sub_categories.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         //close_box("Wait");
         qs("#"+sub_category_id).innerHTML = res;
      },
      error: function(jqXHR,textstatus,errorThrown){
         message_box("Error","show");
      }
   });
}

function load_sub_sub_categories(sub_category_id,sub_sub_category_id){
   //alert_box("Alert","Info", clave,"Accept");
    var data = {sub_category_id};
    data = JSON.stringify(data);
    $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"load_sub_sub_categories.php",
       beforeSend: function(){
          //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
       },
       success: function(res){
          //close_box("Wait");
          qs("#"+sub_sub_category_id).innerHTML = res;
       },
       error: function(jqXHR,textstatus,errorThrown){
          message_box("Error","show");
       }
    });
 }

function number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // Si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);
    // Si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, ' 1' + ',' + ' 2');
    return amount_parts.join('.');
}

function pad_with_zeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}


function search_product_by_name(){
    var business_id = qs("#business_id").innerHTML;
    var account_id = qs("#current_account").innerHTML;
    var product_name = qs("#product_name").value;
    //alert( data_to_search);
    var data = {product_name,business_id,account_id};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"search_product_by_name.php",
        beforeSend: function(){
           
        },
        success: function(res){
           close_box("Wait");
           qs("#Products #window_content #products_found").innerHTML = res;
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
}

function search_product_by_id(){
   var business_id = qs("#business_id").innerHTML;
   var account_id = qs("#current_account").innerHTML;
   var product_id = qs("#product_id").value;
   //alert( data_to_search);
   var data = {product_id,business_id,account_id};
   data = JSON.stringify(data);
   $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"search_product_by_id.php",
       beforeSend: function(){
          //message_box("Wait","Burning","Burning CD...please wait.","Close","Accept");
       },
       success: function(res){
          close_box("Wait");
          qs("#Products #window_content #products_found").innerHTML = res;
       },
       error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
       }
   });
}

function check_current_password(){
    var current_password = qs("#current_password").value;
    var data = {current_password: current_password};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"controllers/check_current_password.php",
        beforeSend: function(){
           //message_box("Wait","Burning","Burning CD...please wait.","Close","Accept");
        },
        success: function(res){
           var res = JSON.parse(res);
           //alert(res.result);
           if (res.status == "success") {
               qs("#new_password").show();
               qs("#confirm_password").show();
           }else{
               qs("#new_password").hide();
               qs("#confirm_password").hide();
           }
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
}

function tab( form, tab, length){
   //console.log(form,tab,length);
   for (var i=1 ; i <= length; i++) {
        $("#"+form+" #tab-"+i).hide();
        $("#"+form+" #tab-"+i).removeClass("show-tab").addClass("tab-hidden");
        $("#"+form+" #button-tab-"+ i).removeClass("tab-button-active").addClass("tab-button");
   };
    $("#"+form+" #tab-"+tab).removeClass("tab-hidden").addClass("show-tab");
    $("#"+form+" #tab-"+tab).show();

   for (var i=1 ; i <= length; i++) {
        $("#button-tab-"+i).removeClass("tab-button-active").addClass("tab-button");
   }
   $("#button-tab-"+tab).removeClass("tab-button").addClass("tab-button-active").blur();
}

$(document).ready(function(){
   for (var i=1 ; i <= 10; i++) {
      //qs("#tab-"+ i).hide();
      $("#tab-"+i).removeClass("show-tab").addClass("tab-hidden");
   };
   $("#tab-"+i).removeClass("tab-hidden").addClass("show-tab");
   $("#tab-1").show();
});

function show_order_info( business_id, branch_id, folio_id, order_id){
    var data =  {business_id,branch_id,folio_id,order_id: order_id};
    data = JSON.stringify(data);
    $.ajax({
       type:"POST",
       datatype:"json",
       data:{"data":data},
       url:"monitor_order_info.php",
       beforeSend: function(){
          //message_box("Wait","Wait","Processing...please wait.","Close");
       },
       success: function(res){
          //close_box("Wait");
          style="width:100%;max-width:100%;height:90%;top:0%;overflow-x:hidden;overflow-y:hidden;";
          window_pop("order",style,function(){
             if (r){
                 qs("#order #window_content").innerHTML = res;    
             }   
          });
       },
       error: function(jqXHR,textstatus,errorThrown){
          close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
       }
    });
}

function finish_delivery_with_end_delivery_code( business_id, branch_id, folio_id, code){
    var data = {business_id,branch_id,folio_id,code};
    data = JSON.stringify(data);
    $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/finish_delivery_with_end_delivery_code.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
             var encoded="on";
             set_order_status_delivered_now( encoded);
             confirm_box("Success","Success","The delivery has been completed successfully.","Accept","",function(){
                 window.location.reload();
             });
         }else{
             alert_box("Error","Error",res.status,"Accept"); return false;
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
    });
}

// Cash_Register functions
function confirm_closing_turn( register_id, turn_id, turn_folio){
   confirm_box("Close","Question","Do you want to close the turn now ?","No&Yes","",function(){
         if (r){
            close_turn( register_id, turn_id, turn_folio);
         }
   });
}

function if_there_are_unpayaccount_ids( register_id, turn_id, turn_folio, callback){
   var business_id = qs("#business_id").innerHTML;
   var branch_id = qs("#branch_id").innerHTML;
   var data = {business_id,branch_id,register_id,turn_id: turn_id,turn_folio: turn_folio};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/check_for_unpayaccount_ids.php",
   })
   .done( function (data) {
      var response=JSON.parse(data);
      //alert(res.result);
      if (res.status == "success") {
         r=true;
         callback(r);
      }else{
         r=false;
         callback(r);
      }
   })
}

 
function close_turn(register_id, turn_id, turn_folio){
   //alert("Hola");
   var business_id = qs("#business_id").innerHTML;
   var branch_id = qs("#branch_id").innerHTML;
   var data = {business_id,branch_id,register_id,turn_id,turn_folio};
   data = JSON.stringify(data);
   //alert( dataCliente);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/close_turn.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.filename);
         if (res.status == "success") {
            confirm_box("Success","Success","The turn has been closed successfuly.","Accept","clickAcceptButton()",function(r){
               var myWindow = window.open(res.filename,'_blank')
               myWindow.opener.location.reload();
            }) ;
         }else{
            alert_box("Info","Info",res.status,"Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function show_order_accounts( branch_id, register_id, concept_id, turn_id, turn_folio ){
   var business_id = qs("#business_id").innerHTML ;
   var data = {business_id,branch_id,register_id: register_id,concept_id: concept_id,turn_id: turn_id,turn_folio: turn_folio};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"views/registers_movements/show_order_accounts.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
         style="width:100%;max-width:500px;height:100%;top:0%;overflow-x:hidden;overflow-y:hidden;";
         window_pop("Accounts",style,function(){
            if (r){
                  qs("#Accounts #window_content").innerHTML = res;    
            }   
         });
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function show_movements( branch_id, register_id, concept_id, turn_id, turn_folio){
   var business_id = qs("#business_id").innerHTML ;
   var data = {business_id,branch_id,register_id: register_id,concept_id: concept_id,turn_id: turn_id,turn_folio: turn_folio};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"views/registers_movements/show_movements.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processing...please wait.","Close");
      },
      success: function(res){
         //close_box("Wait");
         style="width:100%;max-width:500px;height:100%;top:0%;overflow-x:hidden;overflow-y:hidden;";
         window_pop("Movements",style,function(){
            if (r){
                  qs("#Movements #window_content").innerHTML = res;    
            }   
         });
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}



escape = function (str) {
  return str
    .replace(/[\\]/g, '')
    .replace(/[\"]/g, '')
    .replace(/[\/]/g, '/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};

function repeat( html, times){
  for ( i=0; i <  times;  i++){
      document.body.innerHTML +=  html;
  }
}

function go_back() {
   window.history.back();
}

function search_city_by_name(){
    var country_id = qs("country_id").value;
    var cityname = qs("cityname").value;
    // cityname =  cityname.toUpperCase();
    if ( cityname == ''){ qs("#Registrar_Empresa #cityname").setAttribute("placeholder","required").focus(); return false; }
    //alert( data);
    var data = {country_id: country_id,cityname: cityname};
    data = JSON.stringify(data);
    $.ajax({
        type:"POST",
        datatype:"json",
        data:{"data":data},
        url:"controllers/search_city_by_name.php",
        beforeSend: function(){
           //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
        },
        success: function(res){
           close_box("Wait");
           qs("#dropdown_list_cities").innerHTML = res;
        },
        error: function(jqXHR,textstatus,errorThrown){
           close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
        }
    });
}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

function chamgelanguage( id) {
   var language =  qs('#'+ id).value;
   var data = {language: language};
   data = JSON.stringify(data);
   $.ajax({
      type:"POST",
      datatype:"json",
      data:{"data":data},
      url:"controllers/save_my_language.php",
      beforeSend: function(){
         //message_box("Wait","Wait","Processiog...please wait.","Close","Accept");
      },
      success: function(res){
         //close_box("Wait");
         var res = JSON.parse(res);
         //alert(res.result);
         if (res.status == "success") {
             location.reload();
         }else{
             alert_box("Info","Info",res.status,"Accept");
         }
      },
      error: function(jqXHR,textstatus,errorThrown){
         close_box("Wait"); alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
      }
   });
}

function getResolution() {
   alert("Your screen resolution is: " + screen.width + "x" + screen.height);
}


function ordersfilter() {
   //alert("Hola ian. estas ejecutando esta funcion.");
   //window.location.reload();
   var filter = qs("#cmbMonitor").value;
   var food_id = qs("#food_id").innerHTML;
   var business_id = qs("#business_id").innerHTML;
   var branch_id = qs("#branch_id").innerHTML;
   var register_id = qs("#register_id").innerHTML;
   var service_type_id = qs("#service_type_id").innerHTML;
   
   var data = "food_id="+food_id+"&business_id="+business_id+"&branch_id="+branch_id+"&register_id="+register_id+"&service_type_id="+service_type_id+"&filter="+filter;
   data = window.btoa(data);
   location.href = "monitor.php?&s="+ data;

}

function close_session() {
   $.ajax({
     type:"POST",
     datatype:"json",
     //data:{"data":data},
     url:"close_session.php",
     beforeSend: function(){
         message_box("Wait","Wait","Clossing...please wait.","Close");
     },
     success: function(res){
         close_box("Wait");
     },
     error: function(jqXHR,textstatus,errorThrown){
        alert_box("Error","Error","An internal error has occurred.","Accept"); return false;
     }
  });
}

function useLoadingOnClick() {
   window.addEventListener("beforeunload", function (e) {
     e.preventDefault();
     var loader = qs(".lds-ring");
     loader.classList.remove("hidden");
     loader.classList.add("active");     
   });
}

$(document).ready(function(){ 
    useLoadingOnClick();
});

function reload(){
   location.reload();
}

function showLoader(){
   var loader = qs(".lds-ring");
   loader.classList.remove("hidden");
   loader.classList.add("active");
}

function hideLoader(){
   var loader = qs(".lds-ring");
   loader.classList.remove('active');
   loader.classList.add("hidden");
}

function clickTheAddButton( account_id) {
   console.log( account_id);
}

function account_toggle(account_id){
   if ($("#account-"+account_id).hasClass("account-closed")){
       $("#account-"+account_id).removeClass("account-closed").addClass("account-open");
   }else{
       $("#account-"+account_id).removeClass("account-open").addClass("account-closed");
   }
}

function input_error(sel,msg) {
  qs(sel).setAttribute("placeholder",msg);
  qs(sel).classList.add("error");
  qs(sel).focus(); 
}

function serialize(data) {
	let obj = {};
	for (let [key, value] of data) {
		if (obj[key] !== undefined) {
			if (!Array.isArray(obj[key])) {
				obj[key] = [obj[key]];
			}
			obj[key].push(value);
		} else {
			obj[key] = value;
		}
	}
	return obj;
}

function unique_keys(data) {
   let obj = {};
   for (let [key, value] of data) {
       obj[key] = value;
   }
   return obj;
}

