<?php
namespace Storex\Register;
use Storex\AbstractModel,
    Storex\Auth\SessionStorage;
use Storex\Auth\AccessDeniedException;

class UserModel extends AbstractModel{

    public function get($id){
        $id = $this->db->esc($id);
        $query = "SELECT * FROM storex.users WHERE uid = $id";
        $data = $this->db->getRow($query);
        unset($data['password']);
        return $data;
    }

    public function listData($params){
        $query = "SELECT * FROM storex.users";
        $data = $this->db->getRows($query);

        $queryCount = "SELECT COUNT(*) FROM storex.users AS p";
        $count = $this->db->getSingle($queryCount);
        if($data){
            foreach($data as &$item){
                unset($item['password']);
            }
        }
        return array("data" => $data, "count" => $count);

    }

    public function delete($id){
        $id = $this->db->esc($id);
        $query = "DELETE from storex.users WHERE uid = '$id'";
        $this->db->query($query);
    }

    public function insert($data){
        $this->_accessLevelCheck($data['access_level']);
        $iTokens = $this->db->getInsertTokens($data);
        $query = "INSERT INTO storex.users ($iTokens[0], time_added) VALUES ($iTokens[1], NOW())";
        $this->db->query($query);

        $id = $this->db->lastId();
        return $id;
    }

    public function update($data){
        $this->_accessLevelCheck($data['access_level']);
        if(!$data['uid']) return $this->insert($data);
        $uTokens = $this->db->getUpdateTokens($data);
        $query = "UPDATE storex.users SET $uTokens WHERE uid = {$data['uid']}";
        $this->db->query($query);
        return $data['uid'];

    }

    protected function _accessLevelCheck($accessLevel){
        $ss = SessionStorage::getInstance();
        if (@$ss->get("user")['access_level'] < $accessLevel){
            throw new AccessDeniedException("You cannot create/update users with a access level higher than yourself.");
        }
    }

}