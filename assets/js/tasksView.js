/**
 * @class TasksView
 */
class TasksView {
    constructor(){
        this.DOM = Object.create(null);
        this.DOM.cardWrapper = document.getElementById('cardsWrapper');

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        let forms = document.getElementsByClassName('needs-validation');
        Array.prototype.filter.call(forms, function(form){
            form.addEventListener('submit', e => {
                e.preventDefault();
                e.stopPropagation();

                if(!form.checkValidity()) {
                    form.classList.add('was-validated');
                    return;
                }

                switch(form.id){
                    case 'new_task':

                        break;
                    case 'loginForm':
                        postData('/login', formToQueryString(form))
                            .then(data => {
                                if(data.success) {
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
                        break;
                }
            }, false);
        });
    }

    initEvents(){

    }

    revealTask(item, i){
        item.style.opacity = '0';
        item.style.animationDelay = i * 100 + 'ms';
        item.addEventListener('animationend', this.taskRevealed, false);
        item.classList.add('cardReveal');
    }

    taskRevealed(e){
        e.target.removeEventListener('animationend', this.taskRevealed);
        e.target.removeAttribute('style');
        e.target.classList.remove('cardReveal');
    }

    displayTasks(tasks){
        let wrapper = this.DOM.cardWrapper;

        while(wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);

        tasks.forEach((task, i) => {
            let card = this.createCard(task),
                cardBody = card.firstChild;

            if(task.edited)
                cardBody.insertAdjacentHTML('afterbegin',
                    '<span class="badge badge-warning float-right">Edited by admin</span>');

            /*if(localStorage.isAdmin) {
                let text = createElement('textarea', {
                    class: 'form-control',
                    name: 'content',
                    rows: '1'
                }, task.content);
                cardBody.appendChild(text);

                let btn = createElement('button', {class: "btn btn-primary btn-sm float-right mt-1"}, 'Update');
                btn.addEventListener('click', function(){
                    btn.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                    postData('/tasks/update/', `id=${task.id}&content=${text.value}`)
                        .then(R => {
                            btn.removeChild(btn.firstChild);
                            if(R.success) {
                                fireToast(R.text);
                                state.requestData();
                            } else {
                                fireToast(R.text);
                                btnLogin.update();
                                $('#loginModal').modal('show');
                            }
                        });
                });
                cardBody.appendChild(btn);
                cardBody.appendChild(
                    createElement('div', {class: "custom-control custom-checkbox float-left"},
                        createElement('input', {
                            type: "checkbox",
                            id: 'cb' + task.id,
                            class: "custom-control-input"
                        }),
                        createElement('label', {class: "custom-control-label", for: 'cb' + task.id}, 'Done'))
                );
                if(task.completed)
                    cardBody.querySelector('input').checked = true;

                cardBody.lastElementChild.firstElementChild.addEventListener('click', function(e){
                    postData('/tasks/update/', `id=${task.id}&completed=${Number(this.checked)}`)
                        .then(R => {
                            if(R.success) {
                                fireToast(R.text);
                            }
                            else {
                                fireToast(R.text);
                                this.checked = !this.checked;
                            }
                        });
                });

            }*/
            this.revealTask(card, i);
            wrapper.appendChild(card);
        });
    }

    createCard({id, username, email, content, completed}){
        return createElement('div', {class: 'card mb-2', 'data-id': id},
            createElement('div', {class: 'card-body'},
                createElement('h5', {class: 'card-title'}, `${username} <${email}>`),
                createElement('p', {class: 'card-text'}, content),
                createElement('span', {class: 'badge badge-pill badge-secondary'}, completed ? 'Done' : 'Uncompleted')));
    }

    bindAddTodo(handler){
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if(this._todoText) {
                handler(this._todoText)
                this._resetInput()
            }
        })
    }

    bindDeleteTodo(handler){
        this.todoList.addEventListener('click', event => {
            if(event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    bindEditTodo(handler){
        this.todoList.addEventListener('focusout', event => {
            if(this._temporaryTodoText) {
                const id = parseInt(event.target.parentElement.id)

                handler(id, this._temporaryTodoText)
                this._temporaryTodoText = ''
            }
        })
    }

    bindToggleTodo(handler){
        this.todoList.addEventListener('change', event => {
            if(event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }
}