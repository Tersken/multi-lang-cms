<?php
namespace Storex\Auth;
use Storex\Connection\Database,
    Storex\Auth\SessionStorage;
class Authentication {
    
    public function login($username, $password){
        $db = Database::getInstance();
        $username = $db->escape_string($username);
        $password = $db->escape_string($password);
        $query = "SELECT * FROM storex.users WHERE username = '{$username}' AND password = MD5('{$password}')";
        $result = $db->getRow($query);
        if($result){
            SessionStorage::set("user", $result);
        }else {
            throw new AccessDeniedException("You are not allowed to login");
        }
        
        return $result;
    }
    
    public function logout($sid){
        
    }
    
}