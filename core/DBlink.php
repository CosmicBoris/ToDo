<?php
declare(strict_types=1);

namespace ToDo\core;

use Config;

final class DBlink
{
    protected static $_instance = null;
    private $_db;
    private $_sql;
    private $_errors;

    private function __construct()
    {
        $this->_db = new \mysqli(Config::DB_HOST, Config::DB_USER, Config::DB_PASS, Config::DB_NAME);

        if($this->_db->connect_errno){
            trigger_error("MySQL connection error: ( $this->_db->connect_errno ) $this->_db->connect_error", E_USER_ERROR);
        }
    }

    public function __destruct()
    {
        $this->_db->close();
    }

    public static function getInstance(): DBlink
    {
        if(is_null(self::$_instance)) {
            self::$_instance = new self;
        }
        return self::$_instance;
    }

    public function getCount(string $table, string $column, string $where = null)
    {
        $this->_sql = "SELECT COUNT($column) AS c FROM $table";
        if($where)
            $this->_sql .= " WHERE $where";

        if($result = $this->runQuery()) {
            $obj = $result->fetch_assoc();
            $result->close();
            return intval($obj['c']);
        }
        return -1;
    }

    public function getMySqli()
    {
        return $this->_db;
    }

    private function runQuery()
    {
        if(FALSE === $result = $this->_db->query($this->_sql))
            self::setErrors();

        $this->_sql = "";
        return $result;
    }

    /**
     * @param string $query
     * @return array from first row
     */
    public function extractQueryResult(string $query): ?array
    {
        $this->_sql = $query;

        if($r = $this->runQuery()) {
            $output = $r->fetch_assoc();
            $r->close();
            return $output;
        }
        return null;
    }

    /**
     * @param string $query
     * @param callable|null $callback [optional] <p>
     * called for each fetched row
     * </p>
     * @return array of rows
     */
    public function extractQueryResults(string $query, callable $callback = null): array
    {
        $output = [];
        $this->_sql = $query;

        if($r = $this->runQuery()) {
            while($obj = $r->fetch_assoc())
                $output[] = $callback == null ? $obj : $callback($obj);
            $r->close();
        }
        return $output;
    }

    public function lastInsertedId()
    {
        return $this->_db->insert_id;
    }

    private function setErrors()
    {
        $this->_errors = $this->_db->error_list;
        $this->_errors['query'] = $this->_sql;
    }
}