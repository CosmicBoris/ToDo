<?php declare(strict_types=1);

namespace ToDo\core;

final class Storage implements \JsonSerializable
{
    private $data = [];

    public function set(string $name, $value)
    {
        $this->data[$name] = $value;
    }

    public function get(string $name)
    {
        return $this->data[$name] ?? null;
    }

    public function has(string $key): bool
    {
        return isset($this->data[$key]);
    }

    public function __isset(string $name): bool
    {
        return isset($this->data[$name]);
    }

    function jsonSerialize()
    {
        return $this->data;
    }
}