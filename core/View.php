<?php declare(strict_types=1);

namespace ToDo\core;

use Config;

final class View
{
    protected $_title, $_wrapper_layout = Config::MAIN_LAYOUT, $_page_content, $_shared_storage;

    public function __construct(Storage $storage)
    {
        $this->_shared_storage = $storage;
    }

    public function setTitle(string $title)
    {
        $this->_title = $title;
    }

    /**
     *  Build page including markup file(s)
     *
     * @param string $layout - main html file(_wrapper_layout)
     * @param string $view - will be inserted in _wrapper_layout
     *
     * @throws \ErrorException
     */
    public function render(string $layout = null, string $view = null)
    {
        if($layout)
            $this->_wrapper_layout = $layout;
        $v = $view ?? lcfirst(Router::getActionName());

        $this->_page_content = Config::LAYOUT_DIR . Router::getControllerName() . '/' . $v . Config::LAYOUT_TYPE;

        if(!file_exists($this->_page_content)) {
            throw new \ErrorException('file: ' . $this->_page_content . ' not found');
        }
        // include|require won't throw exception!
        require Config::LAYOUT_DIR . $this->_wrapper_layout . Config::LAYOUT_TYPE;
    }

    public function __get($name)
    {
        return $this->_shared_storage->get($name);
    }

    public function __set($name, $value)
    {
        $this->_shared_storage->set($name, $value);
    }

    public function __isset($name)
    {
        return $this->_shared_storage->has($name);
    }
}