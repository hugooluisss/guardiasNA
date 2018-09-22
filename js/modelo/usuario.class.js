TUsuario = function(chofer){
	var self = this;
	self.idUsuario = window.localStorage.getItem("session_na");
	
	this.isLogin = function(){
		if (self.idUsuario == '' || self.idUsuario == undefined || self.idUsuario == null) return false;
		if (self.idUsuario != window.localStorage.getItem("session_na")) return false;
		
		return true;
	};
	
	this.login = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		var result = datos.usuario == 'bvmargarita' && datos.pass == 'oaxaca.1986';
		if (datos.fn.after !== undefined)
			datos.fn.after({"band": result, 'idUsuario': 1});
	}
};