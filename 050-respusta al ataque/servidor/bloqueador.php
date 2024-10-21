<?php
$gatillos = [
    'DROP',
    'DELETE',
    'SELECT',
    ';'
];

function check_for_triggers($data, $gatillos) {
    foreach ($gatillos as $gatillo) {
        if (str_contains(strtolower($data), strtolower($gatillo))) {
            die('{"respuesta":"ataque"}');
        }
    }
}

foreach ($_REQUEST as $clave => $valor) {
    check_for_triggers($clave, $gatillos);
    check_for_triggers($valor, $gatillos);
}

$rawInput = file_get_contents('php://input');

if ($rawInput) {
    check_for_triggers($rawInput, $gatillos);
}
?>
