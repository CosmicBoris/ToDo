<?php

namespace ToDo\Controllers;

use ToDo\core\Controller;

class LogoutController extends Controller
{
    public function actionIndex()
    {
        header("Content-type: application/json");
        // https://www.php.net/manual/ru/function.session-destroy.php
        $_SESSION = [];
        setcookie(session_name(), session_id(), -1);
        echo \json_encode(['operation' => 'logout', 'success' => session_destroy()]);
    }
}