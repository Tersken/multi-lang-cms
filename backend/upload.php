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
$id = $fileModel->saveFile($_FILES['file']);
return $id;