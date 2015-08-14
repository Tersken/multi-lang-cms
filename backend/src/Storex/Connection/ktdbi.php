<?php
namespace Storex\Connection;
use Storex\Connection\ktdbi;
class kvdbtConnectException extends \Exception {
    private $host;
    private $username;
    private $mysqlcode;
    private $mysqlerror;

    function __construct($host=null, $username=null, $mysqlcode=null, $mysqlerror=null) {

        $this->username=$username;
        $this->host=$host;
        $this->mysqlcode=$mysqlcode;
        $this->mysqlerror=$mysqlerror;

        $message="Unable to connect to MySQL server [$host] using username [$username]: [$mysqlerror]";

        parent::__construct($message);
    }

    public function getMysqlCode() {
        return $this->mysqlcode;
    }

    public function getMysqlError() {
        return $this->mysqlerror;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getHost() {
        return $this->host;
    }

}


class ktdbiQueryException extends \Exception {
    private $query;
    private $mysqlcode;
    private $mysqlerror;

    function __construct($q=null, $mysqlcode=null, $mysqlerror=null) {

        $this->mysqlcode=$mysqlcode;
        $this->mysqlerror=$mysqlerror;
        $this->query=$q;

        $message="MySQL query failed: [$mysqlerror]";

        parent::__construct($message);
    }

    public function getMysqlCode() {
        return $this->mysqlcode;
    }

    public function getMysqlError() {
        return $this->mysqlerror;
    }

    public function getOriginalQuery() {
        return $this->query;
    }
}


class ktdbi extends \mysqli {

    // overriden methods
    function __construct() {

        $args = func_get_args();
        @eval("parent::__construct(" . join(',', array_map(array($this, 'add_single_quotes'), $args)) . ");");
        if (mysqli_connect_error()) {
            throw new ktdbiConnectException($args[0], $args[1], mysqli_connect_errno(), mysqli_connect_error());
        }
    }

    function query($query, $resultmode=MYSQLI_STORE_RESULT) {
        $result = parent::query($query, $resultmode);
        if (mysqli_error($this)) {
            throw new ktdbiQueryException($query, mysqli_errno($this), mysqli_error($this));

        }
        return $result;
    }

    // new methods

    public function lastId() {
        return $this->insert_id;
    }

    public function getRow($q) {
		$s=$this->query($q);
		$r=$s->fetch_assoc();
        $s->close();
		return $r;
	}

	public function getSingle($q) {
		$s=$this->query($q);
		$r=$s->fetch_row();
        $s->close();
		if (!$r) return false;
		return ($r[0]);
	}

	public function getIndexedValues($q) {
		$result = array();
		$s=$this->query($q);
			while($row = $s->fetch_row()) {
				$id = array_shift($row);
				$result[(string)$id] = array_shift($row);
			}
		return $result;
	}

    /* no longer static! */
    public function getInsertTokens($inarr) {
		$farr=array();
		$varr=array();
		foreach($inarr as $k=>$v) {
			if (!is_null($v)) {

                if (is_string($v)) {
                    $v=$this->escape_string($v);
                    $v="'$v'";
                } else if (is_int($v) or is_float($v)) {
                    // nothing
                } else if (is_bool($v)) {
                    $v=($v)?1:0;

                } else if (is_array($v) or is_object($v)) {
                    // the value is not scalar
                    $v=$this->escape_string(serialize($v));
                    $v="'$v'";
                } else {
                    throw new \Exception("Parameter [$k] is of an unsupported type");
                }



			} else $v="NULL";
			$farr[]="`$k`";
			$varr[]=$v;
		}
		$fields=implode(', ', $farr);
		$values=implode(', ', $varr);

		return array($fields, $values);
	}

    /* no longer static! */
	public function getUpdateTokens(&$inarr) {
		$finalarr=array();
		foreach($inarr as $k=>$v) {
			if (!is_null($v)) {
                if (is_string($v)) {
                    $v=$this->escape_string($v);
                    $s="`$k` = '$v'";
                } else if (is_int($v) or is_float($v)) {
                    $s="`$k` = $v";
                } else if (is_bool($v)) {
                    $v=($v)?1:0;
                    $s="`$k` = $v";
                } else if (is_array($v) or is_object($v)) {
                    // the value is not scalar
                    $v=$this->escape_string(serialize($v));
                    $s="`$k` = '$v'";
                } else {
                    throw new \Exception("Parameter [$k] is of an unsupported type");
                }
			} else $s="`$k` = NULL";
			$finalarr[]=$s;
		}
		$tokens=implode(', ', $finalarr);
		return $tokens;
	}
    
    function esc($v) {
		if (!is_scalar($v)) $v=serialize($v);
		if (is_int($v) || is_float($v)) {
			// do nothing
		} else if (is_bool($v)) {
			$v=($v)?1:0;
		} else {
			$v=$this->escape_string($v);
		}
		return $v;
	}
	
	
	function qprintf() {
		$args = func_get_args();
		if (count($args) < 2)
			return false;
		$query = array_shift($args);
		$args = array_map(array($this, 'esc'), $args);
		array_unshift($args, $query);
		$query = call_user_func_array('sprintf', $args);
		return $query;
	}


	/**
	 * get num rows property from result set
	 *
	 * @param object mysqli_result $qr
	 * @return int, num rows
	 */
	public function numRows($qr)
	{
		return $qr->mysql_num_rows;
	}


    // helper methods

    /* single quote and escape single quotes and backslashes */
    public static function add_single_quotes($arg) {
        return "'" . addcslashes($arg, "'\\") . "'";
    }
    
    public function getArray($q, $pk=null, $ok=null) {
		$s=$this->query($q);

		$out=array();
		if ($pk) {
			if ($ok) {
				while ($r=$s->fetch_assoc()) $out[$r[$pk]]=$r[$ok];
			} else {
				while ($r=$s->fetch_assoc()) $out[$r[$pk]]=$r;
			}
			
		} else {
			if ($ok) {
				while ($r=$s->fetch_assoc()) $out[]=$r[$ok];
			} else {
				while ($r=$s->fetch_assoc()) $out[]=$r;
			}
			
		}
		$s->close();
		return $out;
	}
	
	function getColumn($q) {
	    $s=$this->query($q);
	    $out=array();
	    while($r=$s->fetch_row()) {
	        $out[]=$r[0];
	    }
	    $s->close();
	    return $out;
	}
	
}

?>