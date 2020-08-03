<?php declare(strict_types=1);

namespace ToDo\core;

class Router
{
    const CTR = 'Controller';
    /** @var array $segments */
    private static $segments;
    private static $namespace;
    private static $defController;
    private static $controllerName;
    private static $actionName = 'Index';

    public function __construct(string $namespace, string $defController = 'Home')
    {
        self::$namespace = $namespace;
        self::$defController = $defController;
        // Uri without get parameters
        self::redirect(strtok($_SERVER['REQUEST_URI'], '?'));
    }

    // PSR-1 camelCase method names
    public static function redirect(string $path)
    {
        self::$segments = explode('/', trim($path, '/'));
        self::start();
    }

    public static function start(): void
    {
        // controllers name Uppercase
        self::$controllerName = ucfirst(self::$segments[0] ?: self::$defController);

        $className = self::$namespace . '\\' . self::$controllerName . self::CTR;

        if(!class_exists($className))
            throw new \InvalidArgumentException("No matching controller class found");

        /** @var Controller $controller */
        $controller = new $className();

        // check if controller single action (__invoke defined)
        if(is_callable($controller)) {
            $controller();
        } // if action present in url
        else if(isset(self::$segments[1])) {
            self::$actionName = ucfirst(self::$segments[1]);
            $action = self::getActionName(true);
            if(!method_exists($controller, $action)) {
                throw new \InvalidArgumentException("The controller action \"$action\" undefined.");
            }
            $controller->$action();
        } // no action passed use default
        else {
            $controller->actionIndex();
        }
    }

    /**
     * @param bool $fullname
     * @return string
     */
    public static function getControllerName(bool $fullname = false): string
    {
        return $fullname ? self::$controllerName . 'Controller' : self::$controllerName;
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
        return self::$segments[$pos] ?: null;
    }
}