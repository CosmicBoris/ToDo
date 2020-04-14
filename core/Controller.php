<?php

namespace ToDo\core;

abstract class Controller
{
    protected
        $_view,
        $_shared_storage;

    public function __construct()
    {
        $this->_shared_storage = new Storage();
        $this->_view           = new View($this->_shared_storage);
    }

    /** default action of every Controller **/
    abstract public function actionIndex();

    // if user require non-existent action
    public function Show404()
    {
        http_response_code(404);
        include_once Config::LAYOUT_DIR.'NotFound'.Config::LAYOUT_TYPE;
    }

    public function __set($name, $value)
    {
        $this->_shared_storage->Set($name, $value);
    }
    public function __get($name)
    {
        return $this->_shared_storage->Get($name);
    }
    public function __isset($name)
    {
        return $this->_shared_storage->has($name);
    }
}