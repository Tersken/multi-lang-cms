<?php
namespace Storex\Auth;
use Storex\Server\JsonRpcException;
class AccessDeniedException extends JsonRpcException {
    public function __construct($message = null, $code = 401, Exception $previous = null){
        parent::__construct($message, $code, $previous);
    }
}