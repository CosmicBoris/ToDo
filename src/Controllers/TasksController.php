<?php

namespace ToDo\Controllers;

use ToDo\core\Controller;
use ToDo\core\Request;
use ToDo\core\Router;
use ToDo\core\paginationHelper;
use ToDo\core\Validator;
use ToDo\Models\TasksModel;

class TasksController extends Controller
{
    private $_model;
    const ITEMS_PER_PAGE = 3;

    public function __construct()
    {
        parent::__construct();
        paginationHelper::setItemsPerPage(self::ITEMS_PER_PAGE);
        $this->_model = new TasksModel();
    }

    public function actionIndex()
    {
        $this->_view->SetTitle('Welcome');
        paginationHelper::setCurrentPage(Router::getUriSegment(1));

        if(Request::isAjax()){
            $tasksCount = $this->_model->getTasksCount();
            $this->pages = ceil($tasksCount / self::ITEMS_PER_PAGE);
            $this->items = [];
            if($tasksCount > 0){
                try {
                    $this->items = $this->_model->getTasks(['sort' => $_GET['sort'], 'limit' => paginationHelper::LimitString()]);
                } catch (\ErrorException $e) {
                    $this->success = false;
                    $this->error = $e->getMessage();
                }
            }
            header("Content-type: application/json");
            echo \json_encode($this->_shared_storage);
        } else
            $this->_view->Render();
    }

    public function actionAdd()
    {
        if(Request::isPost()) {
            header("Content-type: application/json");
            $keys = ['username', 'email', 'content'];
            $result = false;
            $v = Validator::getInstance()->Prepare($_POST, $keys)->CheckForEmpty();
            if(!$v->hasErrors() && $v->CheckEmail('email')) {
                try {
                    $this->_model->addTask($v->getRequiredFields());
                    $result = true;
                } catch (\ErrorException $e) {
                }
            }
            echo \json_encode(['operation' => 'add' ,'success' => $result]);
        }
    }

    public function actionUpdate()
    {
        if(Request::isPost()){
            header("Content-type: application/json");
            if(isset($_SESSION['role']) && $_SESSION['role'] == 'admin'){
                try{
                    if($this->_model->updateTask($_POST)){
                        echo \json_encode(['success' => true, 'text' => 'Task updated']);
                    }
                    else
                        echo \json_encode(['success' => false, 'text' => 'Error updating task']);
                }
                catch (\ErrorException $exception) {
                    echo \json_encode(['success' => false, 'text' => $exception->getMessage()]);
                }
            }
            else
                echo \json_encode(['success' => false, 'text' => 'Admin permission required']);
        }
    }
}