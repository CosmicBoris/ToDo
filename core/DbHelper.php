<?php

namespace ToDo\core;


final class DbHelper
{
    protected static $_instance = null;
    private $_db;
    private $_sql;
    private $_errors;

    private function __construct()
    {
        $this->_db = new \mysqli(Config::DB_HOST, Config::DB_USER, Config::DB_PASS, Config::DB_NAME);

        if($this->_db->connect_errno){
            trigger_error('MySQL connection error: (' . $this->_db->connect_errno . ') ' . $this->_db->connect_error);
            exit();
        }

        $this->_db->set_charset("utf-8");
    }

    public function __destruct()
    {
        $this->_db->close();
    }

    public static function getInstance() : DbHelper
    {
        if(is_null(self::$_instance)) {
            self::$_instance = new self;
        }
        return self::$_instance;
    }

    function getMySqli()
    {
        return $this->_db;
    }

    private function RunQuery()
    {
        if(FALSE === $result = $this->_db->query($this->_sql))
            self::setErrors();

        $this->_sql = "";
        return $result;
    }

    private function setErrors()
    {
        $this->_errors = $this->_db->error_list;
        $this->_errors['query'] = $this->_sql;
        $this->notify();
    }

    function lastInsertedId()
    {
        return $this->_db->insert_id;
    }

    function getCount(string $table, string $column, string $where = null)
    {
        $this->_sql = "SELECT COUNT($column) AS c FROM $table";
        if($where)
            $this->_sql .= " WHERE $where";

        if($result = $this->RunQuery()){
            $obj = $result->fetch_assoc();
            $result->close();
            return intval($obj['c']);
        }
        return -1;
    }
}