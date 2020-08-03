<?php
declare(strict_types=1);

namespace ToDo\Models;

use ToDo\core\Model;

class LoginModel extends Model
{
    public function login(string $login, string $password): bool
    {
        $db = $this->dbLink->getMySqli();
        if(!$stmt = $db->prepare('SELECT login, password FROM admins WHERE login=? LIMIT 1')) {
            throw new \ErrorException("Unable to prepare query: ( $db->errno ) $db->error ");
        }
        $stmt->bind_param('s', $login);
        if(!$stmt->execute()) {
            throw new \ErrorException("Unable execute query: ( $stmt->errno ) $stmt->error");
        }
        $user = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if(password_verify($password, $user['password'])) {
            $_SESSION['login'] = $login;
            $_SESSION['role'] = 'admin';
            return true;
        }
        return false;
    }
}