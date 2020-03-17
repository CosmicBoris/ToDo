<?php
namespace ToDo\core;

class Request
{
    public static function isPost() : bool
    {
        return $_SERVER['REQUEST_METHOD'] == 'POST';
    }
    public static function isAjax() : bool
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
    }
}