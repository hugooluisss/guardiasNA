function callEstadisticas(){
	console.info("Llamando a estadisticas");
	$("#modulo").attr("modulo", "estadisticas").html(plantillas["estadisticas"]);
	setPanel($("#modulo"));
	console.info("Carga de estadisticas finalizada");
	
	$("#txtInicio").datetimepicker({
		format: "Y-m-d",
		timepicker: false
	});
	
	$("#txtFin").datetimepicker({
		format: "Y-m-d",
		timepicker: false
	});
	
	var d = new Date;
	$("#txtInicio").val(d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay());
	$("#txtFin").val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDay());
	
	$("#txtInicio").change(getGuardiasBotadas);
	$("#txtFin").change(getGuardiasBotadas);
	
	getGuardiasBotadas();
	
	function getGuardiasBotadas(){
		$("#lista").find("li").remove();
		$.post(server + 'webservice.php', {
			"inicio": $("#txtInicio").val(),
			"fin": $("#txtFin").val(),
			"action": 'getTotalBotadas'
		}, function(responsables){
			$.each(responsables, function(i, responsable){
				var pl = $(plantillas["itemResponsable"]);
				
				pl.attr("inicio", $("#txtInicio").val());
				pl.attr("fin", $("#txtFin").val());
				pl.attr("datos", responsable.json);
				
				pl.prepend(responsable.responsable);
				pl.find("[campo=botadas]").html(responsable.botadas.length);
			
				$("#lista").append(pl);
			});
		}, "json");
	}
	
	
	$('#winDetalle').on('show.bs.modal', function(event){
		var datos = jQuery.parseJSON($(event.relatedTarget).attr("datos"));
		setDatos($("#winDetalle"), datos);
		
		$('#winDetalle').find("#guardiasBotadas").find("li").remove();
		$.each(datos.botadas, function(i, guardia){
			var pl = $(plantillas["botadaDetalle"]);
			setDatos(pl, guardia);
			
			$('#winDetalle').find("#guardiasBotadas").append(pl);
		});
	});
}