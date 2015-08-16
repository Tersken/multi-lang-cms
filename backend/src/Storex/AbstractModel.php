<?php
namespace Storex;
use Storex\Connection\Database;

abstract class AbstractModel{
    protected $tableName;
    protected $db;
    
    public function __construct(){
        $this->db = Database::getInstance();
    }
    
    abstract function get($id);

    abstract function listData($sid, $params);

    abstract function delete($id);

    abstract function insert($data);

    abstract function update($id, $data);
}