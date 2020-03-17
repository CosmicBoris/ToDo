<?php

namespace ToDo\core;

class paginationHelper
{
    private static $itemsPerPage = 3;
    private static $currentPage = 1;

    static function setItemsPerPage(int $count)
    {
        self::$itemsPerPage = $count;
    }

    static function setCurrentPage($index)
    {
        self::$currentPage = (is_numeric($index) && $index > 0) ? $index : 1;
    }

    static function getCurrentPage() : int
    {
        return self::$currentPage;
    }

    static function LimitRange() : array
    {
        return [(self::$currentPage * self::$itemsPerPage) - self::$itemsPerPage, self::$itemsPerPage];
    }

    static function LimitString() : string
    {
        list($from, $count) = self::LimitRange();
        return "$from, $count";
    }
}