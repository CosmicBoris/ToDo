import {createElement, createSVGElement, formToObject, formToQueryString} from "./util.js";
import EventHandler from "./eventHandler.js";
import TaskCard from "./task.card.js";

/**
 * @class TasksView
 */
export default class TasksView {
    constructor(){
        this.DOM = Object.create(null);
        this.DOM.cardWrapper = document.getElementById('cWrapper');
        this.DOM.forms = document.forms;

        this.initEvents();
    }

    initEvents(){
        this._loginHandler = new EventHandler();

        this._addTaskHandler = new EventHandler();
        this._editTaskHandler = new EventHandler();
        this._toggleTaskHandler = new EventHandler();
        this._deleteTaskHandler = new EventHandler();

        this._onTaskEdit = e => {
            if(this._temporaryTodoText) {
                const id = parseInt(e.target.closest("[data-id]").dataset.id);
                this._editTaskHandler.notify(null, {id, value: this._temporaryTodoText});
                this._temporaryTodoText = '';
            }
        }

        this._onTaskToggle = e => {
            if(e.target.type === 'checkbox') {
                const id = parseInt(e.target.closest("[data-id]").dataset.id);
                this._toggleTaskHandler.notify(null, {id, state: e.target.checked});
            }
        }

        this._onTaskDelete = e => {
            if(e.target.dataset.hint === 'delete') {
                const id = parseInt(e.target.closest("[data-id]").dataset.id);
                this._deleteTaskHandler.notify(null, id);
            }
        }

        this._onFormSubmit = e => {
            e.preventDefault();
            const form = e.target;

            if(form.classList.contains("needs-validation") && !form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            switch(form.name){
                case 'new_task':
                    this._addTaskHandler.notify(null, formToObject(form));
                    break;
                case 'login':
                    this._loginHandler.notify(null, formToQueryString(form));
                    break;
            }
        }

        for(let form of this.DOM.forms){
            form.addEventListener('submit', this._onFormSubmit, false);
        }

        this.DOM.cardWrapper.addEventListener('click', this._onTaskDelete);
        this.DOM.cardWrapper.addEventListener('change', this._onTaskToggle);
        this.DOM.cardWrapper.addEventListener('focusout', this._onTaskEdit);
        this.DOM.cardWrapper.addEventListener('input', e => {
            if(e.target.isContentEditable) {
                this._temporaryTodoText = e.target.innerText;
            }
        });
    }

    taskAdded(){
        $('#collapseOne').collapse('hide');
        this.DOM.forms.new_task.classList.remove('was-validated');
        this.DOM.forms.new_task.reset();
    }

    taskRevealed(e){
        e.target.removeEventListener('animationend', this.taskRevealed);
        e.target.removeAttribute('style');
        e.target.classList.remove('task-card_revealing');
    }

    revealTask(card, i){
        card.style.opacity = '0';
        card.style.animationDelay = i * 150 + 'ms';
        card.addEventListener('animationend', this.taskRevealed, false);
        card.classList.add('task-card_revealing');

        /*let a = AnimationUtil();
        a.addUpdateListener(() => {
            const v = `rotateX(${a.getAnimatedRawValue()}deg)`;
            item.style["-webkit-transform"] = v;
            item.style["transform"] = v;
        })
        a.setDuration(1500);
        a.setInterpolator(a.EasingFunctions.springRelaxed);
        a.setValues(-90, 0);
        setTimeout(() =>{a.start()}, i * 150);*/
    }

    displayTasks(tasks){
        let wrapper = this.DOM.cardWrapper;

        while(wrapper.firstChild)
            wrapper.removeChild(wrapper.firstChild);

        tasks.forEach((task, i) => {
            const card = new TaskCard(task).element;
            this.revealTask(card, i);
            wrapper.appendChild(card);
        });
    }

    fireToast(message){
        let t = $('#apptoast');
        t.find(".toast-body").text(message);
        t.toast('show');
    }

    set onLoginSubmit(cb){
        this._loginHandler.on(cb);
    }

    set onTaskSubmit(cb){
        this._addTaskHandler.on(cb);
    }

    set onTaskEdit(cb){
        this._editTaskHandler.on(cb);
    }

    set onTaskToggle(cb){
        this._toggleTaskHandler.on(cb);
    }

    set onTaskDelete(cb){
        this._deleteTaskHandler.on(cb);
    }
}