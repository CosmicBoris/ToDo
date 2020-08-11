import TasksView from "./tasksView.js";
import TasksProvider from "./tasksProvider.js";
import DropdownSort from "./dropdown.js";
import Pagination from "./pagination.js";

/**
 *  Old fashion functional approach
 **/
const TasksManager = function(){
    this.init();
};

const proto = TasksManager.prototype;

proto.init = function(){
    this._model = TasksProvider();
    this._view = new TasksView();
    this._sort = DropdownSort({
        container: "#sortWrapper",
        items: {'s': 'Status', 'u': 'User name', 'e': 'Email'},
        callback: this.start.bind(this),
    });
    this._sort.hide();
    this._pagination = Pagination(document.getElementById('pagination'));

    this.initEvents();
};

proto.initEvents = function(){
    this.onTasksListChanged = (sender, data) => {
        data.items.length > 1 || data.pages > 1 ? this._sort.show() : this._sort.hide();
        this._pagination.setPage = data.pages;
        this._view.displayTasks(data.items);
    };

    this.onAddTask = todoText => {
        this._model.addTask(todoText);
    };

    this.onEditTask = (id, todoText) => {
        this._model.editTask(id, todoText);
    };

    this.onToggleTask = id => {
        this._model.toggleTask(id);
    };

    this.onDeleteTask = id => {
        this._model.deleteTask(id);
    };

    this._model.onDataSetChanged = this.onTasksListChanged;
};

proto.start = function(){
    this._model.requestData(this._pagination.current, this._sort.value);
};

export default TasksManager;