import EventHandler from "./eventHandler.js";
import {getData, postData} from "./util.js";

/* Factory function */
const TasksProvider = () => {
    let _taskAdded = new EventHandler();
    let _taskEdited = new EventHandler();
    let _taskToggled = new EventHandler();
    let _taskDeleted = new EventHandler();
    let _dataChanged = new EventHandler();
    let localTasks;
    const context = Object.create(null);


    context.addTask = (task) => {
        /*postData('/tasks/add', formToQueryString(form))
            .then(R => {
                if(R.success) {
                    _taskAdded.notify();
                }
            });*/

        task.id = localTasks.length + 1;
        task.date = new Date().getTime(); // Also Date.now()
        localTasks.push(task);
        localStorage.tasks = JSON.stringify(localTasks);

        _taskAdded.notify();
    };

    context.editTask = (id, updatedText) => {
        postData('/tasks/update/', `id=${id}&content=${updatedText}`)
            .then(R => {
                if(R.success) {
                    _taskEdited.notify();
                } else {
                    fireToast(R.text);
                    btnLogin.update();
                    $('#loginModal').modal('show');
                }
            });
    };

    context.toggleTask = (id, state) => {
        postData('/tasks/update/', `id=${id}&completed=${Number(state)}`)
            .then(R => _taskToggled.notify(null, R));
    };

    context.deleteTask = id => {
        /*postData('/tasks/delete/', `id=${id}`)
            .then(R => _taskDeleted.notify(null, R));*/

        localTasks = localTasks.filter(task => task.id !== id);
        localStorage.tasks = JSON.stringify(localTasks);
        _dataChanged.notify(null, {items: localTasks, pages: 1});
    };

    context.requestData = (page, order) => {
        /*getData(`/tasks/${page}?sort=${order}`)
            .then(data => _dataChanged.notify(null, data));*/

        localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        _dataChanged.notify(null, {items: localTasks, pages: 1});
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