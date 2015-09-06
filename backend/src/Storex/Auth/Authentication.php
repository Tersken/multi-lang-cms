<?php
namespace Storex\Auth;
use Storex\Connection\Database,
    Storex\Auth\SessionStorage,
    Storex\Auth\AccessDeniedException;

class Authentication {
    
    public function login($username, $password){
        $db = Database::getInstance();
        $username = $db->escape_string($username);
        $password = $db->escape_string($password);
        $query = "SELECT uid, username, email, acces_level FROM storex.users WHERE username = '{$username}' AND password = MD5('{$password}')";
        $result = $db->getRow($query);
        if($result){
            $ss = SessionStorage::getInstance();
            $ss->set("user", $result);
            return session_id();
        }else {
            throw new AccessDeniedException("You are not allowed to login");
        }
        
        return $result;
    }

    public function check($sid){
        $ss = SessionStorage::getInstance();
        $ss->setSessionId($sid);
        return $ss->get("user");
    }
    
    public function logout($sid){
        return SessionStorage::destroy();
    }
    
}

