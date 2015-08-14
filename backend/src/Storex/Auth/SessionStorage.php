<?php
namespace Storex\Auth;
class SessionStorage {
    protected $sessionId;
    protected static $instance;
    //put your code here
    
    protected function __construct(){
        session_start();
    }
        
    static function getInstance(){
        if(null === self::$instance){
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function setSessionId($sid){
        session_id($sid);
    }
    
    public function set($key, $value){
        $_SESSION[$key] = $value;
    }
    
    public function get($key){
        return $_SESSION[$key];
    }
    
    
    
}
