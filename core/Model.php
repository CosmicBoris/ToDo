<?php
namespace ToDo\core;

abstract class Model
{
    // link to database and helper methods
    protected $dbLink;

    public function __construct()
    {
        $this->dbLink = DBlink::getInstance();
    }
}