<?php

namespace ToDo\Controllers;

use ToDo\core\Controller;
use ToDo\core\Request;
use ToDo\Models\LoginModel;

class LoginController extends Controller
{
    public function actionIndex()
    {
        if(Request::isPost()){
            header("Content-type: application/json");
            if(isset($_POST['login']) && isset($_POST['password'])){
                $this->_model = new LoginModel();
                echo \json_encode(['operation' => 'login',
                    'success' => $this->_model->Login($_POST['login'], $_POST['password'])]);
            }
        } else
            parent::Show404();
    }
}