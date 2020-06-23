'use strict';

/**
 * @class ButtonInOut
 *
 * Two-state login/logout button
 */
class ButtonInOut {
    constructor(cbFn){
        this.btn = document.getElementById('btnLogin');
        this.cbFn = cbFn;
        this.initEvents();
        this.update();
    }

    initEvents(){
        this.onclickFn = e => {
            e.preventDefault();
            if(localStorage.isAdmin) {
                getData('/logout').then(R => {
                    if(R.success) {
                        deleteAllCookies();
                        localStorage.clear();
                        this.update();
                        this.cbFn && this.cbFn();
                    }
                });
            } else
                $('#loginModal').modal('show');
        };
        this.btn.addEventListener('click', this.onclickFn, false);
    }

    update(){
        this.btn.innerText = localStorage.isAdmin ? 'Sign Out' : 'Sign In';
    }
}

const Pagination = (container, callbackFn) => {
    let _pagesCount = 0, currentPage = 1;

    const
        update = _ => {
            while(ul.firstChild)
                ul.removeChild(ul.firstChild);
            if(_pagesCount < 2)
                return;
            for(let i = 1; i <= _pagesCount; i++){
                ul.insertAdjacentHTML('beforeend', `<li class="page-item${i === currentPage ? ' active' : ''}"><a class="page-link">${i}</a></li>`);
            }
        },
        onItemClick = e => {
            e.preventDefault();
            let page = parseInt(e.target.innerText);
            if(currentPage !== page) {
                currentPage = page;
                update();
                callbackFn && callbackFn(currentPage);
            }
        };

    let ul = document.createElement("ul");
    ul.className = "pagination justify-content-center";
    ul.addEventListener('click', onItemClick, false);
    container.appendChild(ul);

    return {
        show: _ => { ul.style.visibility = "visible"; },
        hide: _ => { ul.style.visibility = "hidden"; },
        set setPages(value){
            _pagesCount = value;
            update();
        },
        get currentPage(){ return currentPage; }
    };
};

const Sort = callbackFn => {
    let _itemsHolder = null;

    const ACTIVE_ITEM_CLASS = 'active';

    function init(){
        _itemsHolder = document.getElementById("dropdownItemsHolder");
        if(localStorage.sort) {
            let item = _itemsHolder.querySelector(`button[data-rule="${localStorage.sort}"]`);
            if(item) {
                _itemsHolder.querySelector("button." + ACTIVE_ITEM_CLASS).classList.remove(ACTIVE_ITEM_CLASS);
                item.classList.add(ACTIVE_ITEM_CLASS);
            } else {
                item = _itemsHolder.querySelector("button." + ACTIVE_ITEM_CLASS);
                localStorage.sort = item.getAttribute('data-rule');
            }
        }
        initEvents();
    }

    function initEvents(){
        _itemsHolder.addEventListener('click', onItemClick, false);
    }

    function onItemClick(e){
        let val = e.target.getAttribute('data-rule');
        if(localStorage.sort !== val) {
            localStorage.sort = val;
            _itemsHolder.querySelector("button.active").classList.remove(ACTIVE_ITEM_CLASS);
            e.target.classList.add(ACTIVE_ITEM_CLASS);
            callbackFn && callbackFn();
        }
    }

    init();

    return {
        show: _ => {
            _itemsHolder.parentElement.style.visibility = "visible";
        },
        hide: _ => {
            _itemsHolder.parentElement.style.visibility = "hidden";
        },
        getOrder: _ => {
            return localStorage.sort != null ? '?sort=' + localStorage.sort : '';
        }
    };
};

const createElement = function(name, attributes){
    let node = document.createElement(name);
    for(let attr in attributes){
        if(attributes.hasOwnProperty(attr))
            node.setAttribute(attr, attributes[attr]);
    }
    for(let i = 2; i < arguments.length; i++){
        let child = arguments[i];
        if(typeof child === 'string')
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
};

const TasksManager = () => {
    const onPageChanged = (page) => {
        state.requestData();
    };
    const revealed = e => {
        e.target.removeEventListener('animationend', revealed);
        e.target.style.opacity = 1;
        e.target.style.animationDelay = 0;
    };
    const reveal = (item, i) => {
        item.style.opacity = 0;
        item.style.animationDelay = i * 100 + 'ms';
        item.addEventListener('animationend', revealed, false);
    };
    const populateCards = items => {
        while(_cardWrapper.firstChild){
            _cardWrapper.removeChild(_cardWrapper.firstChild);
        }

        items.forEach((task, i) => {

            let card = createElement('div', {class: 'card mb-2 cardReveal', 'data-id': task.id},
                createElement('div', {class: 'card-body'},
                    createElement('h5', {class: 'card-title'}, `${task.username} <${task.email}>`)));

            let cardBody = card.firstChild;


            if(task.edited)
                cardBody.insertAdjacentHTML('afterbegin', `<span class="badge badge-warning float-right">Edited by admin</span>`);

            if(localStorage.isAdmin) {
                let text = createElement('textarea', {
                    className: 'form-control',
                    name: 'content',
                    rows: '1'
                }, task.content);
                cardBody.appendChild(text);

                let btn = createElement('button', {className: "btn btn-primary btn-sm float-right mt-1"}, 'Update');
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
                    createElement('div', {className: "custom-control custom-checkbox float-left"},
                        createElement('input', {
                            type: "checkbox",
                            id: 'cb' + task.id,
                            className: "custom-control-input"
                        }),
                        createElement('label', {className: "custom-control-label", for: 'cb' + task.id}, 'Done'))
                );
                if(task.completed)
                    cardBody.querySelector('input').checked = true;

                cardBody.lastElementChild.firstElementChild.addEventListener('click', function(e){
                    postData('/tasks/update/', `id=${task.id}&completed=${Number(this.checked)}`)
                        .then(response => {
                            if(response.success) {
                                fireToast(response.text);
                                state.requestData();
                            } else {
                                fireToast(response.text);
                                this.checked = !this.checked;
                            }
                        });
                });
            } else {
                cardBody.appendChild(createElement('p', {className: 'card-text'}, task.content));
                cardBody.insertAdjacentHTML('beforeend', `<span class="badge badge-pill badge-secondary">${task.completed ? 'Done' : 'Uncompleted'}</span>`);
            }
            reveal(card, i);
            _cardWrapper.appendChild(card);
        });
    };

    let state = {
        requestData: () => {
            getData(`/tasks/${_pagination.currentPage}${_sort.getOrder()}`)
                .then(data => {
                    data.items.length > 1 || data.pages > 1 ? _sort.show() : _sort.hide();
                    populateCards(data.items);
                    _pagination.setPages = data.pages;
                });
        }
    };

    let _cardWrapper = document.getElementById('cardsWrapper');
    let _pagination = Pagination(document.getElementById('pagination'), onPageChanged);
    let _sort = Sort(state.requestData);

    return state;
};

async function postData(url = '', data){
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = ''){
    const response = await fetch(url, {
        method: 'GET',
        headers: {"X-Requested-With": "XMLHttpRequest"}
    });
    return await response.json();
}

const fireToast = (massage) => {
    let t = $('#apptoast');
    t.find(".toast-body").text(massage);
    t.toast('show');
};

const deleteAllCookies = () => {
    document.cookie.split(";").forEach(cookie => {
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 2000 00:00:00 GMT";
    });
};

const tasksManager = TasksManager();
const btnLogin = new ButtonInOut(() => tasksManager.requestData());

window.addEventListener('load', () => {
    tasksManager.requestData();

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
                    postData('/tasks/add', $(form).serialize())
                        .then(data => {
                            if(data.success) {
                                tasksManager.requestData();
                                fireToast("Success, task added!");
                                $('#collapseOne').collapse('hide');
                                form.classList.remove('was-validated');
                                form.reset();
                            }
                        });
                    break;
                case 'loginForm':
                    postData('/login', $(form).serialize())
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
}, false);