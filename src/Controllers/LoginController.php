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
                $model = new LoginModel();
                try {
                    $result = $model->Login($_POST['login'], $_POST['password']);
                }
                catch (\ErrorException $e) {
                    exit('Login model error');
                }

                echo \json_encode(['operation' => 'login', 'success' => $result]);
            }
        }
        else
            parent::Show404();
    }
}