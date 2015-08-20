<?php
namespace Storex\Cms;
use Storex\AbstractModel,
    Storex\Auth\SessionStorage;

class MenuModel extends AbstractModel{

    public function get($sid, $id){
        $id = $this->db->esc($id);
        $query = "SELECT * FROM storex.pages WHERE pageUid = $id";
        $data = $this->db->getRow($query);
        return $data;
    }

    public function listData($sid, $params){
        $query = "SELECT* FROM storex.menu";
        $data = $this->db->getRows($query);
        
        $queryCount = "SELECT COUNT(*) FROM storex.menu";
        $count = $this->db->getSingle($queryCount);
        
        return array("data" => $data, "count" => $count);

    }
    
    public function getMenu($sid, $id){
        $query = "SELECT mu.*, page.title FROM storex.menu_items AS mu 
                    LEFT JOIN storex.pages AS page ON (page.pageUid = mu.target AND mu.is_module = 0)  
                    WHERE menu_uid = {$id}";
        $data = $this->db->getRows($query, 'uid');
        
        foreach($data as $key => $item){
            if($item['parent_uid'] > 0){
                $data[$item['parent_uid']]['subitems'][] = $item;
                unset($data[$key]);
            }
        }
        usort($data, array("Storex\Cms\MenuModel", "cmp"));
        return $data;
        
    }
    
    static function cmp( $a, $b ) { 
        if(  $a['rank'] ==  $b['rank'] ){ return 0 ; } 
        return ($a['rank'] < $b['rank']) ? -1 : 1;
    } 
    
    public function saveMenu($sid, $menuUid, $items){
        $rank = 0;
        $this->deleteMenuItems($sid, $menuUid);
        foreach($items as $item){
            $tokens = array(
                "target" => array_key_exists('pageUid', $item) ? $item['pageUid'] : $item['target'],
                "is_module" => 0,
                "menu_uid" => $menuUid,
                "parent_uid" => 0,
                "rank" => $rank
            );
            $itemId = $this->insert($sid, $tokens);
            $rank++;
            $subRank = 0;
            if(!array_key_exists("subitems", $item)){
                continue;
            }
            foreach($item['subitems'] as $subitem){
                $subtokens = array(
                    "target" => array_key_exists('pageUid', $subitem) ? $subitem['pageUid'] : $subitem['target'],
                    "is_module" => 0,
                    "menu_uid" => $menuUid,
                    "parent_uid" => $itemId,
                    "rank" => $subRank
                );
                $this->insert($sid, $subtokens);
                $subRank++;
            }
        }
        return $items;
    }

    public function deleteMenu($sid, $menuUid){
        $query = "DELETE FROM storex.menu_items WHERE menu_uid = {$menuUid}";
        $this->db->query($query);
        
        $query = "DELETE FROM storex.menu WHERE uid = {$menuUid}";
        $this->db->query($query);
    }
    
    public function deleteMenuItems($sid, $menuUid){
        $query = "DELETE FROM storex.menu_items WHERE menu_uid = {$menuUid}";
        $this->db->query($query);
    }

    public function delete($sid, $id){

    }

    public function insert($sid, $data){
        $iTokens = $this->db->getInsertTokens($data);
        $query = "INSERT INTO storex.menu_items ($iTokens[0]) VALUES ($iTokens[1])";
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