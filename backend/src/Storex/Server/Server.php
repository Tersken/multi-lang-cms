<?php
namespace Storex\Server;
use Storex\Auth\Authentication;
use \JsonRPC\AuthenticationFailure;

class Server extends \JsonRPC\Server
{
    /**
     * Execute a method
     *
     * @access public
     * @param  mixed     $class        Class name or instance
     * @param  string    $method       Method name
     * @param  array     $params       Procedure params
     * @return mixed
     */
    public function executeMethod($class, $method, $params)
    {
        //Do Session checking
        if("login" != $method){
            $auth = new Authentication();
            $sid = array_shift($params);
            $user = $auth->check($sid);
            if(!$user['uid'] || $user['uid'] < 1){
                throw new AuthenticationFailure('You do not have access.');
            }

        }

        return parent::executeMethod($class, $method, $params);
    }
}