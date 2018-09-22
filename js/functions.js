server = "http://localhost/guardiasNA/";

var idUsuario = undefined;
/*
*
* Centra verticalmente una ventana modal
*
*/
function reposition(modal, dialog) {
	modal.css('display', 'block');
	
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

function checkConnection() {
	try{
		var networkState = navigator.connection.type;
	
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		
		switch(networkState){
			case Connection.NONE: 
				alertify.error("Verifica tu conexión, la aplicación necesita conexión a internet");
				return false;
			break;
			default:
				return true;
		}
	}catch(e){
		return true;
	}
}

function getDistancia(lat1, lon1, lat2, lon2){
	rad = function(x) {return x*Math.PI/180;}
	
	var R = 6378.137;
	var dLat = rad(lat2 - lat1);
	var dLong = rad(lon2 - lon1);
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	return d.toFixed(3); //Retorna tres decimales
}

var mensajes = {
	alert: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		try{
			navigator.notification.alert(data.mensaje, data.funcion, data.titulo, data.boton);
		}catch(err){
			window.alert(data.mensaje);
		}

	},
	
	confirm: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.confirm(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			if (confirm(data.mensaje))
				data.funcion(1);
			else
				data.funcion(2);
		}
	},
	
	log: function(data){
		alertify.log(data.mensaje);
	},
	
	prompt: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.prompt(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			var result = prompt(data.mensaje);
			data.funcion({
				buttonIndex: 1,
				input1: result
			});
		}
	},
};

function setDatos(plantilla, datos){
	$.each(datos, function(i, valor){
		antes = plantilla.find("[campo=" + i + "]").attr("before") || ""; 
		despues = plantilla.find("[campo=" + i + "]").attr("after") || ""; 
		valor =  antes + valor + despues;
		plantilla.find("[campo=" + i + "]").html(valor);
		plantilla.find("[campo=" + i + "]").val(valor);
	});
}

function setPanel(el){
	if (el == undefined)
		el = $("body");
		
	el.find("[showpanel]").click(function(){
		callPanel($(this).attr("showpanel"));
	});
}

function getPlantillas(after){
	var cont = 0;
	$.each(plantillas, function(){
		cont++;
	});
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
			
			cont--;
			if (cont == 0)
				after();
		});
	});
};


function activarNotificaciones(){
	window.plugins.PushbotsPlugin.initialize("5b840a5a69b5ee631a277055", {
		"android":{
			"sender_id":"588582936060",
			"icon": "icon",
			"iconColor": "#FFFFFF"
		}
	});
	
	// Should be called once app receive the notification only while the application is open or in background
	window.plugins.PushbotsPlugin.on("notification:received", function(data){
		console.log("received:", data);
		var datos = JSON.stringify(data);
		window.plugins.PushbotsPlugin.resetBadge();
		
		//Silent notifications Only [iOS only]
		//Send CompletionHandler signal with PushBots notification Id
		window.plugins.PushbotsPlugin.done(data.pb_n_id);
		if (data.aps.alert != '')
			alertify.success(data.aps.alert);
			
		window.plugins.PushbotsPlugin.resetBadge();
	});
	
	// Should be called once the notification is clicked
	window.plugins.PushbotsPlugin.on("notification:clicked", function(data){
		console.log("clicked:" + JSON.stringify(data));
		if (data.message != undefined)
			alertify.success(data.message);
			
		window.plugins.PushbotsPlugin.resetBadge();
	});
	
	//window.plugins.PushbotsPlugin.debug(true);
	// Should be called once the device is registered successfully with Apple or Google servers
	window.plugins.PushbotsPlugin.on("registered", function(token){
		console.log("Token de registro", token);
	});
	
	//Get device token
	window.plugins.PushbotsPlugin.getRegistrationId(function(token){
	    console.log("Registration Id:" + token);
	});	
	
	window.plugins.PushbotsPlugin.on("user:ids", function (data) {
		console.log("user:ids" + JSON.stringify(data));
		// userToken = data.token; 
		// userId = data.userId
	});
	
	window.plugins.PushbotsPlugin.resetBadge();
	window.plugins.PushbotsPlugin.toggleNotifications(true);
	window.plugins.PushbotsPlugin.setAlias("usuario_" + objUsuario.idTransportista);
	window.plugins.PushbotsPlugin.tag("transportista");
}