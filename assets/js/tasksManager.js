import TasksView from "./tasksView.js";
import TasksProvider from "./tasksProvider.js";
import DropdownSort from "./dropdown.sort.js";
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
        container: "#sWrapper",
        items: {'d': 'Date', 's': 'Status'},
        callback: this.start.bind(this),
    });
    this._sort.hide();
    this._pagination = Pagination(document.getElementById('pagination'));

    this.initEvents();
};

proto.initEvents = function(){
    this.onLogin = (sender, query) => {
        postData('/login', query)
            .then(R => {
                if(R.success) {
                    $('#validationServer05').removeClass('is-invalid');
                    localStorage.isAdmin = true;
                    btnLogin.update();
                    fireToast("ADMIN IN DA HOUSE!");
                    tasksManager.requestData();
                    $('#loginModal').modal('hide');
                    form.classList.remove('was-validated');
                    form.reset();
                } else {
                    $('#validationServer05').addClass('is-invalid');
                }
            });
    };


    this.onAddTask = (sender, task) => {
        this._model.addTask(task);
    };

    this.onTaskAdded = (sender, obj) => {
        this.start();
        this._view.fireToast("Success, task added 🥳");
        this._view.taskAdded();
    };


    this.onToggleTask = (sender, {id, state}) => {
        this._model.toggleTask(id, state);
    };

    this.onTaskToggled = (sender, id) => {
        this.start();
    };


    this.onEditTask = (sender, {id, value}) => {
        this._model.editTask(id, value);
    };

    this.onTaskEdited = (sender, id) => {
        this._view.fireToast("task updated 🥳");
    };


    this.onDeleteTask = (sender, id) => {
        this._model.deleteTask(id);
    };

    this.onTaskDeleted = (sender, id) => {

    };


    this.onTasksListChanged = (sender, data) => {
        data.items.length > 1 || data.pages > 1 ? this._sort.show() : this._sort.hide();
        this._pagination.setPage = data.pages;
        this._view.displayTasks(data.items);
    };

    this._view.onLoginSubmit = this.onLogin;
    this._view.onTaskSubmit = this.onAddTask;
    this._view.onTaskEdit = this.onEditTask;
    this._view.onTaskToggle = this.onToggleTask;
    this._view.onTaskDelete = this.onDeleteTask;

    this._model.onTaskAdded = this.onTaskAdded;
    this._model.onTaskEdited = this.onTaskEdited;
    this._model.onTaskToggled = this.onTaskToggled;

    this._model.onDataSetChanged = this.onTasksListChanged;
};

proto.start = function(){
    this._model.requestData(this._pagination.current, this._sort.value);
};

export default TasksManager;