TGuardia = function(chofer){
	var self = this;
	
	this.update = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'webservice.php', {
				"id": datos.id,
				"responsable": datos.responsable,
				"movil": true,
				"action": "update"
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.addBotada = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'webservice.php', {
				"id": datos.id,
				"fecha": datos.fecha,
				"hora": datos.hora,
				"responsable": datos.responsable,
				"movil": true,
				"action": "add"
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
};