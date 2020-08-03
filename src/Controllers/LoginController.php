<?php declare(strict_types=1);

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
                    $result = $model->login($_POST['login'], $_POST['password']);
                    if($result) {
                        /*
                        * If an attacker managed to set his session id cookie to a another client
                        * than when client login PHP will associate attackers cookie with newly created session
                        * for different person.
                        * So I will generate new identifier on success login and set it to httpOnly */
                        session_regenerate_id(true);
                        $expire = 0;
                        if($_POST['remember']) {
                            /*
                             * By default PHP sets session id without expire date
                             * so cookie has session lifetime(till browser closed)
                             * next sets expire date */
                            $expire = strtotime("+1 week");
                        }
                        setcookie(session_name(), session_id(), $expire, "", "", false, true);
                    }
                }
                catch (\ErrorException $e) {
                    exit('Login model error');
                }
                echo \json_encode(['operation' => 'login', 'success' => $result]);
            }
        }
        else
            parent::show404();
    }
}