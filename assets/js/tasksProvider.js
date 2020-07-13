/* Factory function */
const TasksProvider = () => {
    let _dataChanged = new EventHandler();

    const context = Object.create(null);

    context.addTask = (task) => {
        postData('/tasks/add', formToQueryString(form))
            .then(R => {
                if(R.success) {
                    tasksManager.requestData();
                    fireToast("Success, task added!");
                    $('#collapseOne').collapse('hide');
                    form.classList.remove('was-validated');
                    form.reset();
                }
            });
    };

    context.editTask = (id, updatedText) => {

    };

    context.deleteTask = (id) => {

    };

    context.toggleTask = (id) => {

    };

    context.requestData = (page, order) => {
        getData(`/tasks/${page}?sort=${order}`)
            .then(data => _dataChanged.notify(null, data));
    };

    Object.defineProperty(context, 'onDataSetChanged', {
        enumerable: false,
        set: function(cb){
            _dataChanged.on(cb);
        }
    });

    return context;
};