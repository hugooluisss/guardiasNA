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
	case 'getBotadas':
		$sql = "select * from botada order by fecha desc";
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		$datos = array();
		while($row = $rs->fetch_assoc()){
			$row['diaLetra'] = diaLetra($row['dia']); 
			array_push($datos, $row);
		}
		echo json_encode($datos);
	break;
	case 'getResponsable':
		$dia = date("N", strtotime($_POST['fecha']));
		
		$sql = "select * from guardia where dia = ".$dia." and hora = '".$_POST['hora']."'";
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		$row = $rs->fetch_assoc();
		echo json_encode($row);
	break;
	case 'addBotada':
		$dia = date("N", strtotime($_POST['fecha']));
		$sql = "insert into botada(fecha, hora, responsable, dia) values ('".$_POST['fecha']."', ".$_POST['hora'].", '".$_POST['responsable']."', '".$dia."')";
		
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		
		echo json_encode(array("band" => $rs));
	break;
	case 'delBotada':
		$sql = "delete from botada where fecha = '".$_POST['fecha']."' and hora = '".$_POST['hora']."'";
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		
		echo json_encode(array("band" => $rs));
	break;
	case 'getTotalBotadas':
		$sql = "select responsable, count(*) as total from botada where fecha between '".$_POST['inicio']."' and '".$_POST['fin']."' group by responsable order by total desc";
		$rs = $db->query($sql) or errorMySQL($db, $sql);
		$datos = array();
		while($row = $rs->fetch_assoc()){
			//$row['diaLetra'] = diaLetra($row['dia']); 
			$row['botadas'] = array();
			
			$sql = "select * from botada where fecha between '".$_POST['inicio']."' and '".$_POST['fin']."' and responsable = '".$row['responsable']."' order by fecha desc";
			
			$rs2 = $db->query($sql) or errorMySQL($db, $sql);
			while($row2 = $rs2->fetch_assoc()){
				$row2['diaLetra'] = diaLetra($row2['dia']); 
				array_push($row["botadas"], $row2);
			}
			
			$row['json'] = json_encode($row);
			
			array_push($datos, $row);
		}
		echo json_encode($datos);
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