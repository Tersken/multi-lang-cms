<?php
namespace Storex;
use Storex\Connection\Database;

abstract class AbstractModel{
    protected $tableName;
    protected $db;
    
    public function __construct(){
        $this->db = Database::getInstance();
    }
    
    abstract function get($sid, $id);

    abstract function listData($sid, $params);

    abstract function delete($sid, $id);

    abstract function insert($sid, $data);

    abstract function update($sid, $data);
}