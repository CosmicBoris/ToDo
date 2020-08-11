import TasksManager from "./tasksManager.js";

/**
 * @class ButtonInOut
 *
 * Two-state login/logout button
 */
class ButtonInOut {
    constructor(callback){
        this.btn = document.getElementById('btnLogin');
        this.cb = callback;
        this.initEvents();
        this.update();
    }

    initEvents(){
        this.onClickFn = e => {
            e.preventDefault();
            if(localStorage.isAdmin) {
                getData('/logout').then(R => {
                    if(R.success) {
                        localStorage.removeItem('isAdmin');
                        this.update();
                        if(typeof this.cb === "function")
                            this.cb();
                    }
                });
            } else
                $('#loginModal').modal('show');
        };
        this.btn.addEventListener('click', this.onClickFn, false);
    }

    update(){
        this.btn.innerText = localStorage.isAdmin ? 'Sign Out' : 'Sign In';
    }
}

const tasksManager = new TasksManager();
const btnLogin = new ButtonInOut(_ => tasksManager.requestData());
tasksManager.start();