<?php
require_once("vendor/autoload.php");
require_once("autoloader.php");

use JsonRPC\Server;

$server = new Server;
$config = new \Server\Configurator();
$config->configurate($server);


$server->attach(new \Server\Configurator);

echo $server->execute();

?>