<?php

namespace ToDo\core;

final class Storage implements \JsonSerializable
{
    private $data = [];

    public function set($name, $value)
    {
        $this->data[$name] = $value;
    }

    public function get($name)
    {
        return $this->data[$name] ?? null;
    }

    public function has($key)
    {
        return isset($this->data[$key]);
    }

    public function __isset($name){
        return isset($this->data[$name]);
    }

    function jsonSerialize()
    {
        return $this->data;
    }
}