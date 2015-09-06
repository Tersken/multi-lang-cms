<?php
namespace Storex\Register;
use Storex\AbstractModel,
    Storex\Auth\SessionStorage;

class UserModel extends AbstractModel{

    public function get($id){
        $id = $this->db->esc($id);
        $query = "SELECT * FROM storex.users WHERE uid = $id";
        $data = $this->db->getRow($query);
        return $data;
    }

    public function listData($params){
        $query = "SELECT * FROM storex.users";
        $data = $this->db->getRows($query);

        $queryCount = "SELECT COUNT(*) FROM storex.users AS p";
        $count = $this->db->getSingle($queryCount);

        return array("data" => $data, "count" => $count);

    }

    public function delete($id){

    }

    public function insert($data){
        $ss = SessionStorage::getInstance();
        $iTokens = $this->db->getInsertTokens($data);
        $query = "INSERT INTO storex.users ($iTokens[0], time_added) VALUES ($iTokens[1], NOW())";
        $this->db->query($query);

        $id = $this->db->lastId();
        return $id;
    }

    public function update($data){
        $iTokens = $this->db->getInsertTokens($data);
        $query = "REPLACE INTO storex.users ($iTokens[0]) VALUES ($iTokens[1])";
        $this->db->query($query);
        return $data['uid'];

    }

}