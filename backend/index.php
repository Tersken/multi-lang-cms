<?php
error_reporting(E_ALL);
ini_set("display_errors",1);
require_once("vendor/autoload.php");
require_once("autoloader.php");
require_once("config.php");

use JsonRPC\Server;

$server = new Server;
//Sets all available methods
Storex\Server\Configurator::configure($server);
       
//Actually execute the request
echo $server->execute();

?>