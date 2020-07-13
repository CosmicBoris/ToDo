<?php
namespace ToDo\core;


class Router
{
    const CTR = 'Controller';
    private static $segments = array();
    private static $controllerName;
    private static $actionName;
    private static $namespace;
    private static $defController;

    public function __construct($namespace, $defController = 'Home')
    {
        self::$namespace = $namespace;
        self::$defController = $defController;
        // Uri without get parameters
        self::Redirect(@strtok($_GET['url'], '?'));
    }

    public static function Redirect(string $path)
    {
        self::$segments = explode('/', $path);
        self::Start();
    }

    public static function Start(): void
    {
        /** @var Controller $controller */

        // controllers name Uppercase
        self::$controllerName = ucfirst(self::$segments[0] ?: self::$defController);

        $controllerName = self::$namespace . '\\' . self::$controllerName . self::CTR;

        if(!class_exists($controllerName)) {
            $controllerName = self::$namespace . '\\' . self::$defController . self::CTR;
            $controller = new $controllerName();
            $controller->Show404();
            return;
        }

        $controller = new $controllerName();

        self::$actionName = ucfirst(self::$segments[1]) ?: '';
        $action = self::getActionName(true);
        if(method_exists($controller, $action)) {
            $controller->{$action}();
        } else {
            self::$actionName = 'Index';
            $controller->actionIndex();
        }
    }

    /**
     * @param bool $fullname
     * @return string
     */
    public static function getControllerName(bool $fullname = false): string
    {
        return $fullname ? self::$controllerName . "Controller" : self::$controllerName;
    }

    /**
     * @param bool $fullname
     * @return string
     */
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
        return self::$segments[$pos] ?? null;
    }
}