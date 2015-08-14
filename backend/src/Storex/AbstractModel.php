<?php
namespace Storex;
use Storex\Connection\Database;

abstract class AbstractModel{
    protected $tableName;
    protected $db;
    
    public function __construct(){
        $this->db = new Database();
    }
    
    public function get($id){
        $query = "SELECT * FROM {$this->tableName} WHERE uid = '$id' LIMIT 1";
    }

    public function listData(){

    }

    public function delete(){

    }

    public function insert(){

    }

    public function update(){

    }
}