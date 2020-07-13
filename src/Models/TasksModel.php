<?php
namespace ToDo\Models;

use ToDo\core\Model;

final class TasksModel extends Model
{
    function addTask($data): void
    {
        $db = $this->dbLink->getMySqli();

        if(!($stmt = $db->prepare("INSERT INTO tasks (username, email, content) VALUES (?,?,?)"))) {
            throw new \ErrorException("Не удалось подготовить запрос: (" . $db->errno . ") " . $db->error);
        }
        $stmt->bind_param("sss", $data['username'], $data['email'], $data['content']);
        if(!$stmt->execute()) {
            throw new \ErrorException("Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error);
        }
        $stmt->close();
    }

    function getTasks($pars): array
    {
        $sortOptions = ['sa' => 'completed ASC', 'sd' => 'completed DESC', 'ua' => 'username ASC', 'ud' => 'username DESC', 'ea' => 'email ASC', 'ed' => 'email DESC',];

        if(isset($pars['sort']) && array_key_exists($pars['sort'], $sortOptions)) {
            $order = $sortOptions[$pars['sort']];
        } else
            $order = 'completed DESC';

        $db = $this->dbLink->getMySqli();

        $query = "SELECT id, username, email, content, completed, edited FROM tasks ORDER BY $order LIMIT {$pars['limit']}";

        if (!($stmt = $db->prepare($query))){
            throw new \ErrorException("Не удалось подготовить запрос: (" . $db->errno . ") " . $db->error);
        }
        if (!$stmt->execute()){
            throw new \ErrorException("Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error);
        }
        $r = $stmt->get_result();

        $tasks = [];
        while($row = $r->fetch_assoc()) {
            $tasks[] = $row;
        }

        $stmt->close();
        return $tasks;
    }

    function getTasksCount(): int
    {
        return $this->dbLink->getCount('tasks', 'id');
    }

    function updateTask($task): int
    {
        $id = $task['id'];
        unset($task['id']);
        if(isset($task['content']))
            $task['edited'] = '1';

        $db = $this->dbLink->getMySqli();

        $i = 0;
        $set = '';
        foreach($task as $key => $value) {
            if(++$i > 1)
                $set .= ', ';
            $set .= "$key=?";
        }

        $sql = "UPDATE tasks SET $set WHERE id=$id";
        if(!($stmt = $db->prepare($sql))) {
            throw new \ErrorException("Не удалось подготовить запрос: (" . $db->errno . ") " . $db->error);
        }
        $types = str_repeat('s', count($task));
        $stmt->bind_param($types, ...array_values($task));
        if(!$stmt->execute()) {
            throw new \ErrorException("Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error);
        }

        $result = $stmt->affected_rows;
        $stmt->close();

        return $result;
    }
}