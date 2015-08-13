<?php
namespace Storex;

abstract class AbstractModel{
    protected $tableName;
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