<?php
//error_reporting(0);
use ToDo\core\Router;

require_once __DIR__ . '/core/Config.php';
require __DIR__ . '/vendor/autoload.php';

session_name("sid");
session_start();

new Router('ToDo\Controllers', 'Tasks');