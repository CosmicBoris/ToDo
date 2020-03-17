<?php
namespace ToDo\core;

class Model
{
    // link to database and DbHelper methods
    protected $dbLink;

    public function __construct()
    {
        $this->dbLink = DbHelper::getInstance();
    }
}