<?php

namespace ToDo\core;

final class Validator
{
    protected static $_instance = null;
    private $_data;
    private $_required_fields;
    private $_errors = array();

    private function __construct(){ }

    /**
     * @param $data
     * @param $ignored
     * @return array|string
     */
    private function getSafeString($data, $ignored)
    {
        if(is_array($data)) {
            foreach($data as $key => $value) {
                if(is_array($ignored)) { // we have keys to ignore
                    if(!in_array($key, $ignored)) { // if key that we don`t ignore
                        $data[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                    }
                } else { // we don`t have keys to ignore
                    $data[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                }
            }
            return $data;
        }
        return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }

    public static function getInstance()
    {
        if(is_null(self::$_instance)) {
            self::$_instance = new self;
        }
        return self::$_instance;
    }

    public function Prepare($data, $required_fields = false, $ignored = false)
    {
        $this->_data = $this->getSafeString($data, $ignored);
        $this->_required_fields = $required_fields;
        return $this;
    }

    public function CheckForEmpty()
    {
        if(!empty($this->_required_fields) && is_array($this->_required_fields)) {
            foreach($this->_required_fields as $key) {
                if(is_null($this->_data[$key]))
                    $this->_errors['empty'][] = $key;
            }
        } else {
            foreach((array)$this->_data as $key => $value) {
                if(empty($value)) {
                    $this->_errors['empty'][] = $key;
                }
            }
        }
        return $this;
    }

    public function getField($key)
    {
        if(is_array($this->_data) && isset($this->_data[$key])){
            return $this->_data[$key];
        }
        return null;
    }

    public function getRequiredFields() : array
    {
        $fields = [];
        foreach($this->_required_fields as $field)
            $fields[$field] = $this->getField($field);
        return $fields;
    }

    public function CheckEmail(string $key)
    {
        return filter_var($this->getField($key), FILTER_VALIDATE_EMAIL);
    }

    public function hasErrors() : bool
    {
        return !empty($this->_errors);
    }

    public function getErrors(): array
    {
        return $this->_errors;
    }
}