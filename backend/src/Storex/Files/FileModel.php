<?php
namespace Storex\Files;
use Storex\AbstractModel;
use Storex\Auth\SessionStorage;
/**
 * Created by PhpStorm.
 * User: Koen Tersago
 * Date: 10/09/2015
 * Time: 20:05
 */
class FileModel extends AbstractModel
{

    public function saveFile($fileObject){
        $localPath = $fileObject['tmp_name'];
        $destinationFolder = "files";
        $this->_saveFileToDisk($destinationFolder."/".$fileObject['name'], $localPath);
        $this->insert($fileObject['name']);
    }

    protected function _saveFileToDisk($destination, $localPath){
        move_uploaded_file($localPath, $destination);
    }

    protected function _removeFileFromDisk($path){
        unlink("files/".$path);
    }


    function get($id)
    {
        $id = $this->db->esc($id);
        $query = "SELECT * FROM storex.files WHERE uid = $id";
        return $this->db->getRow($query);
    }

    function listData($params)
    {
        $query = "SELECT f.*, u.username FROM storex.files AS f
                LEFT JOIN storex.users AS u ON (f.userid = u.uid)";
        $data = $this->db->getRows($query);

        $queryCount = "SELECT COUNT(*) FROM storex.files AS f";
        $count = $this->db->getSingle($queryCount);

        return array("data" => $data, "count" => $count);
    }

    function delete($id)
    {
        $data = $this->get($id);
        $id = $this->db->esc($id);

        $query = "DELETE FROM storex.files WHERE uid = $id";
        $this->db->query($query);

        $this->_removeFileFromDisk($data['location']);
    }

    function insert($data)
    {
        if(!is_array($data)){
            $data = [
                "location" => $data,
                "name" => $data
            ];
        }
        $ss = SessionStorage::getInstance();
        $data['userid'] = $ss->get("user")['uid'];
        $data['access_level'] = 1;

        $iTokens = $this->db->getInsertTokens($data);
        $query = "INSERT INTO storex.files ($iTokens[0], time_added) VALUES ($iTokens[1], NOW())";
        $this->db->query($query);
        return $this->db->lastId();
    }

    function update($data)
    {
        $id = $this->db->esc($data['uid']);
        $uTokens = $this->db->getUpdateTokens($data);
        $query = "UPDATE storex.files SET $uTokens WHERE uid = $id";
        $this->db->query($query);
        return $id;
    }
}