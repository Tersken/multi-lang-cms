<?php
namespace Storex\Cms;
use Storex\AbstractModel,
    Storex\Auth\SessionStorage;

class PageModel extends AbstractModel{

    public function get($sid, $id){
        $id = $this->db->esc($id);
        $query = "SELECT * FROM storex.pages WHERE pageUid = $id";
        $data = $this->db->getRow($query);
        return $data;
    }

    public function listData($sid, $params){
        $query = "SELECT p.*, u.username FROM storex.pages AS p
                LEFT JOIN storex.users AS u ON (p.userid = u.uid)";
        $data = $this->db->getRows($query);
        
        $queryCount = "SELECT COUNT(*) FROM storex.pages AS p";
        $count = $this->db->getSingle($queryCount);
        
        return array("data" => $data, "count" => $count);

    }

    public function delete($sid, $id){

    }

    public function insert($sid, $data){
        $ss = SessionStorage::getInstance();
        $data['userid'] = $ss->get("user")['uid'];
        $iTokens = $this->db->getInsertTokens($data);
        $query = "INSERT INTO storex.pages ($iTokens[0], time_added) VALUES ($iTokens[1], NOW())";
        $this->db->query($query);

        $id = $this->db->lastId();
        return $id;
    }

    public function update($sid, $data){
        $iTokens = $this->db->getInsertTokens($data);
        $query = "REPLACE INTO storex.pages ($iTokens[0]) VALUES ($iTokens[1])";
        $this->db->query($query);
        return $data['pageUid'];

    }

}