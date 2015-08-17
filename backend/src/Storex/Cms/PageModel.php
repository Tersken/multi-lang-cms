<?php
namespace Storex\Cms;
use Storex\AbstractModel;

class PageModel extends AbstractModel{

    public function get($sid, $id){
        $id = $this->db->esc($id);
        $query = "SELECT * FROM storex.pages WHERE pageUid = $id";
        $data = $this->db->getRow($query);
        return $data;
    }

    public function listData($sid, $params){
        $query = "SELECT * FROM storex.pages";
        $data = $this->db->getRows($query);
        return $data;

    }

    public function delete($sid, $id){

    }

    public function insert($sid, $data){
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