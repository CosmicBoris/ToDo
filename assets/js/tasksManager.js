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
    this._sort = Sort(this.start.bind(this));
    this._pagination = Pagination(document.getElementById('pagination'), this.start.bind(this));

    this.initEvents();
};

proto.initEvents = function(){
    this.onTasksListChanged = (sender, data) => {
        data.items.length > 1 || data.pages > 1 ? this._sort.show() : this._sort.hide();
        this._pagination.setPages = data.pages;
        this._view.displayTasks(data.items);
    };

    this._model.onDataSetChanged = this.onTasksListChanged;
};

proto.start = function(){
    this._model.requestData(this._pagination.currentPage, this._sort.order);
};