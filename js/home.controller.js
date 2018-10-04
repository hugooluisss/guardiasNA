function callHome(){
	console.info("Llalmando a home");
	$("#modulo").attr("modulo", "home").html(plantillas["home"]);
	setPanel($("#modulo"));
	console.info("Carga de home finalizada");
	var guardia = new TGuardia;
	
	$("#txtFecha").datetimepicker({
		format: "Y-m-d",
		timepicker: false
	});
	
	$("#selHora").change(function(){
		getResponsableGuardia();
	});
	
	var d = new Date;
	$("#txtFecha").val(d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDay());
	$("[campo=diaSemana]").text(getDiaSemana());
	
	$("#txtFecha").change(function(){
		$("[campo=diaSemana]").text(getDiaSemana());
		guardia = new TGuardia;
		guardia.getResponsable({
			"fecha": $("#txtFecha").val(),
			"hora": $("#selHora").val(),
			"fn": {
				after: function(resp){
					$("#txtResponsable").val(resp.responsable);
				}
			}
		});
	});
	
	$("#btnSalir").click(function(){
		alertify.confirm("¿Seguro?", function(e){
    		if(e) {
    			window.plugins.PushbotsPlugin.removeTags(["transporitsta"]);
    			window.plugins.PushbotsPlugin.removeAlias();
	    		window.localStorage.removeItem("session");
	    		location.href = "index.html";
	    		cordova.plugins.backgroundMode.disable();
	    	}
    	});
	});
	
	function getDiaSemana(){
		var dt = new Date($("#txtFecha").val());
		switch(dt.getUTCDay()){
			case 0: return "Domingo"; break;
			case 1: return "Lunes"; break;
			case 2: return "Martes"; break;
			case 3: return "Miercoles"; break;
			case 4: return "Jueves"; break;
			case 5: return "Viernes"; break;
			case 6: return "Sábado"; break;
		}
	}
	
	getResponsableGuardia();
	function getResponsableGuardia(){
		var guardia = new TGuardia;
		guardia.getResponsable({
			"fecha": $("#txtFecha").val(),
			"hora": $("#selHora").val(),
			"fn": {
				after: function(resp){
					$("#txtResponsable").val(resp.responsable);
				}
			}
		});
	}
	
	$("#frmAddGuardia").validate({
		debug: true,
		rules: {
			txtFecha: "required",
			txtDia: "required",
			txtResponsable: "required"
		},
		wrapper: 'span', 
		submitHandler: function(form){
			var guardia = new TGuardia;
			guardia.addBotada({
				fecha: $("#txtFecha").val(),
				hora: $("#selHora").val(),
				responsable: $("#txtResponsable").val(),
				fn: {
					after: function(resp){
						if (resp.band){
							$("#txtResponsable").val("");
							getBotadas();
							mensajes.log({"mensaje": "Registro agregado"});
						}else
							mensajes.alert({"mensaje": "Error"});
					}
				}
			})
        }

    });
    
    
    getBotadas();	
	function getBotadas(){
		$("#listaGuardias").find("li").remove();
		$.post(server + 'webservice.php', {
			"action": 'getBotadas'
		}, function(guardias){
			$.each(guardias, function(i, guardia){
				var pl = $(plantillas["botada"]);
				setDatos(pl, guardia);
				pl.attr("identificador", guardia.idGuardia);
				
				pl.click(function(){
					mensajes.confirm({"titulo": "Eliminar", "mensaje": "¿Seguro de eliminar?", "botones": "Si, No", "funcion": function(resp){
						if (resp == 1){
							var obj = new TGuardia;
							obj.delBotada({
								"fecha": guardia.fecha,
								"hora": guardia.hora,
								"fn": {
									after: function(resp){
										mensajes.log({"mensaje": "Guardia borrada"});
										if (resp.band)
											getBotadas();
										else
											mensajes.alert({"titulo": "Error", "mensaje": "No se pudo borrar"});
									}
								}
							});
						}
					}});
				});
			
				$("#listaGuardias").append(pl);
			});
		}, "json");
	}
}