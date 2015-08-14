<?php
namespace Storex\Connection;
use Storex\Connection\ktdbi;
class Database {
    protected static $instance;
    protected static $options = array();

    private function __construct() {
       
    }

    public static function getInstance() {
        if( !self::$instance ) {
            self::$instance = new ktdbi(
                    self::$options['host'],
                    self::$options['user'],
                    self::$options['password'],
                    self::$options['database']
            );
        }
        return self::$instance;
    }

    public static function setOptions( array $opt ) {
        self::$options = array_merge(self::$options, $opt);
    }

}

