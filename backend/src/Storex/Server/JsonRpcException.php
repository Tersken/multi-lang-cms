<?php
namespace Storex\Server;

class JsonRpcException extends \Exception {
    public function __construct($message = null, $code = 0, Exception $previous = null){
        $jsonObj = ["jsonrpc" => "2.0", "error" => ["code" => $code, "message" => $message], "id" => null];
        echo json_encode($jsonObj);
        die;
    }
}
