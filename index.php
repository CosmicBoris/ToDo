<?php declare(strict_types=1);

//error_reporting(0);
use ToDo\core\Router;

require_once __DIR__ . '/src/Config.php';
require __DIR__ . '/vendor/autoload.php';

session_name(\Config::SESSION_ID);
session_start();

new Router('ToDo\Controllers', 'Tasks');