<?php
namespace Storex\Auth;
class SessionStorage {
    protected $sessionId;
    protected static $instance;
    //put your code here
    
    protected function __construct(){
        if(!session_id()) session_start();
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

    public static function destroy(){
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        return session_destroy();
    }
    
    
    
}
