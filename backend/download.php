<?php
/**
 * Created by PhpStorm.
 * User: Koen Tersago
 * Date: 10/09/2015
 * Time: 18:05
 */
error_reporting(E_ALL);
ini_set("display_errors",1);
require_once("vendor/autoload.php");
require_once("autoloader.php");
require_once("config.php");

use Storex\Auth\Authentication;
use \JsonRPC\AuthenticationFailure;
use Storex\Files\FileModel;

$auth = new Authentication();
$sid = $_GET['sid'];
$user = $auth->check($sid);
if(!$user['uid'] || $user['uid'] < 1){
    throw new AuthenticationFailure('You do not have access.');
}

$fileModel = new FileModel();
$file = $fileModel->get($_GET['uid']);
$fileLocation = "files/".$file['location'];

if (file_exists($fileLocation)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($fileLocation).'"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($fileLocation));
    readfile($fileLocation);
    exit;
}
