<?php

namespace ToDo\Models;

use ToDo\core\Model;

class LoginModel extends Model
{
    public function Login($l, $p) : bool
    {
        $db = $this->dbLink->getMySqli();
        if(!($stmt = $db->prepare("SELECT login, password FROM admins WHERE login=? LIMIT 1"))) {
            throw new \ErrorException("Не удалось подготовить запрос: (" . $db->errno . ") " . $db->error);
        }
        $stmt->bind_param('s', $l);
        if (!$stmt->execute()){
            throw new \ErrorException("Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error);
        }

        $user = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if(password_verify($p, $user['password'])){
            $_SESSION['login'] = $l;
            $_SESSION['role']  = 'admin';
            return true;
        }
        return false;
    }
}