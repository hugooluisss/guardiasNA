function callCalendario(){
	console.info("Llalmando a calendario");
	$("#modulo").attr("modulo", "calendario").html(plantillas["calendario"]);
	setPanel($("#modulo"));
	console.info("Carga de calendario finalizada");
	
	$("#selDia").change(getGuardias);
	
	getGuardias();	
	function getGuardias(){
		$("#lista").find("li").remove();
		$.post(server + 'webservice.php', {
			"dia": $("#selDia").val(),
			"action": 'getGuardias'
		}, function(guardias){
			var pl;
			for(i in guardias){
				pl = $(plantillas["guardia"]);
				guardia = guardias[i];
				setDatos(pl, guardia);
				pl.attr("identificador", guardia.idGuardia);
				pl.click(function(){
					responsable = prompt("¿Quien es el nuevo responsable?");
					el = $(this);
					if (responsable != ''){
						obj = new TGuardia;
						obj.update({
							"id": el.attr("identificador"),
							"responsable": responsable,
							"fn": {
								after: function(resp){
									if (resp.band)
										getGuardias();
									else
										mensajes.alert({"titulo": "Error al guardar", "mensaje": "No se pudo guardar"});
								}
							}
						});
					}
				});
			
				$("#lista").append(pl);
			}
		}, "json");
	}
}