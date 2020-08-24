import EventHandler from "./eventHandler.js";
import {getData, postData} from "./util.js";

/* Factory function */
const TasksProvider = () => {
    let _taskAdded = new EventHandler();
    let _taskEdited = new EventHandler();
    let _taskToggled = new EventHandler();
    let _taskDeleted = new EventHandler();
    let _dataChanged = new EventHandler();

    const context = Object.create(null);

    let tasks;

    context.addTask = (task) => {
        /*postData('/tasks/add', formToQueryString(form))
            .then(R => {
                if(R.success) {
                    _taskAdded.notify();
                }
            });*/

        task.id = tasks.length + 1;
        task.date = new Date().getTime(); // Also Date.now()
        tasks.push(task);
        localStorage.tasks = JSON.stringify(tasks);

        _taskAdded.notify();
    };

    context.editTask = (id, updatedText) => {

    };

    context.toggleTask = id => {


        _taskToggled.notify(null, id);
    };

    context.deleteTask = id => {

    };

    context.requestData = (page, order) => {
        /*getData(`/tasks/${page}?sort=${order}`)
            .then(data => _dataChanged.notify(null, data));*/

        tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        _dataChanged.notify(null, {items: tasks, pages: 1});
    };

    Object.defineProperty(context, 'onTaskAdded', {
        enumerable: false,
        set: function(cb){
            _taskAdded.on(cb);
        }
    });

    Object.defineProperty(context, 'onTaskEdited', {
        enumerable: false,
        set: function(cb){
            _taskEdited.on(cb);
        }
    });

    Object.defineProperty(context, 'onTaskToggled', {
        enumerable: false,
        set: function(cb){
            _taskToggled.on(cb);
        }
    });

    Object.defineProperty(context, 'onTaskDeleted', {
        enumerable: false,
        set: function(cb){
            _taskDeleted.on(cb);
        }
    });

    Object.defineProperty(context, 'onDataSetChanged', {
        enumerable: false,
        set: function(cb){
            _dataChanged.on(cb);
        }
    });

    return context;
};

export default TasksProvider;