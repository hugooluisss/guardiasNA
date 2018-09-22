<?php
$user = 'root';
$pass = 'k0rgk0rg';
$server = 'localhost';
$baseDatos = 'guardiasNA';

$db = new mysqli($server, $user, $pass, $baseDatos);
if ($db->connect_errno) {
	echo "Falló la conexión a MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
	exit(-1);
}else
	$db->query("SET NAMES utf8");
	
switch($_POST['action']){
	case 'getGuardias':
		$sql = "select * from guardia where dia = ".$_POST['dia'];
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		$datos = array();
		while($row = $rs->fetch_assoc()){
			$row['diaLetra'] = diaLetra($row['dia']); 
			array_push($datos, $row);
		}
		echo json_encode($datos);
	break;
	case 'update':
		$sql = "update guardia set responsable = '".$_POST['responsable']."' where idGuardia = ".$_POST['id'];
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		echo json_encode(array("band" => $rs?true:false));
	break;
}

function diaLetra($dia){
	switch($dia){
		case 1: return "Lunes";
		case 2: return "Martes";
		case 3: return "Miercoles";
		case 4: return "Jueves";
		case 5: return "Viernes";
		case 6: return "Sábado";
		case 7: return "Domingo";
	}
}
?>