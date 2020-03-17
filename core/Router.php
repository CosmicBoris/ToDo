<?php

namespace ToDo\core;

class Router
{
    private static $segments = [];
    private static $controllerName;
    private static $actionName;

    public function __construct()
    {
        // Uri without get parameters
        self::Redirect(strtok($_GET['url'], '?'));
    }

    public static function Start() : void
    {
        /** @var Controller $controller */

        // [0] имя контролера с большой буквы
        self::$controllerName = !empty(self::$segments[0]) ? ucfirst(self::$segments[0]) : Config::DEFAULT_CONTROLLER;
        $controller_name = 'ToDo\\Controllers\\' . self::$controllerName . 'Controller';

        if(!class_exists($controller_name)) {
            $controller_name = "ToDo\Controllers\\" . Config::DEFAULT_CONTROLLER . 'Controller';
            $controller = new $controller_name();
            $controller->Show404();
            return;
        }

        $controller = new $controller_name();

        self::$actionName = !empty(self::$segments[1]) ? ucfirst(self::$segments[1]) : "";
        $action = self::getActionName(true);
        if(method_exists($controller, $action)) {
            $controller->{$action}();
        } else {
            self::$actionName = Config::DEFAULT_ACTION;
            $controller->actionIndex();
        }
    }

    public static function Redirect(string $path)
    {
        self::$segments = explode('/', $path);
        self::Start();
    }

    public static function getControllerName(bool $fullname = false): string
    {
        return $fullname ? self::$controllerName . "Controller" : self::$controllerName;
    }

    public static function getActionName(bool $fullname = false): string
    {
        return $fullname ? 'action' . self::$actionName : self::$actionName;
    }

    /**
     * @param int $pos
     * @return string
     */
    public static function getUriSegment(int $pos): ?string
    {
        return self::$segments[$pos] ?? false;
    }
}