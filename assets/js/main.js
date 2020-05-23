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
        Update = _ => {
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
                Update();
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
            Update();
        },
        get currentPage(){ return currentPage; }
    };
};

const Sort = callbackFn => {
    let _itemsHolder = null,
        _currentValue = null;
    const
        ACTIVE_ITEM_CLASS = 'active',
        Show = _ => {
            _itemsHolder.parentElement.style.visibility = "visible";
        },
        Hide = _ => {
            _itemsHolder.parentElement.style.visibility = "hidden";
        },
        getOrder = _ => {
            return localStorage.sort != null ? '?sort=' + localStorage.sort : '';
        };

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
            _itemsHolder.querySelector("button.active").classList.remove('active');
            e.target.classList.add("active");
            callbackFn && callbackFn();
        }
    }

    init();
    return {Show, Hide, getOrder};
};

const TasksManager = () => {
    let state = {
        RequestData: () => {
            getData(`/tasks/${_pagination.currentPage}${_sort.getOrder()}`)
                .then(data => {
                    data.items.length > 1 || data.pages > 1 ? _sort.Show() : _sort.Hide();
                    PopulateCards(data.items);
                    _pagination.setPages = data.pages;
                });
        }
    };
    const OnPageChanged = (page) => {
        state.RequestData();
    };
    const Revealed = (e) => {
        e.target.removeEventListener('animationend', Revealed);
        e.target.style.opacity = 1;
        e.target.style.animationDelay = 0;
    };
    const Reveal = (item, i) => {
        item.style.opacity = 0;
        item.style.animationDelay = i * 100 + 'ms';
        item.addEventListener('animationend', Revealed, false);
    };
    const PopulateCards = items => {
        _cardWrapper.innerText = '';
        items.forEach((task, i) => {
            let card = Object.assign(document.createElement('div'), {className: 'card mb-2 cardReveal'}),
                cardBody = Object.assign(document.createElement('div'), {className: 'card-body'}),
                h5 = Object.assign(document.createElement('h5'), {
                    className: 'card-title',
                    innerText: `${task.username} <${task.email}>`
                });
            cardBody.appendChild(h5);
            let text = document.createElement("textarea");
            text.className = "form-control";
            text.setAttribute('name', 'content');
            text.setAttribute('rows', '1');
            text.innerHTML = task.content;
            if(task.edited)
                cardBody.insertAdjacentHTML('afterbegin', `<span class="badge badge-warning float-right">Edited by admin</span>`);
            if(localStorage.isAdmin) {
                card.setAttribute("data-id", task.id);
                cardBody.appendChild(text);
                let btn = document.createElement('button');
                btn.className = "btn btn-primary btn-sm float-right mt-1";
                btn.innerHTML = 'Update';
                btn.addEventListener('click', function(){
                    btn.insertAdjacentHTML('afterbegin', '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                    postData('/tasks/update/', `id=${task.id}&content=${text.value}`)
                        .then(response => {
                            btn.innerHTML = 'Update';
                            if(response.success) {
                                fireToast(response.text);
                                state.RequestData();
                            } else {
                                fireToast(response.text);
                                lbtn.Update();
                                $('#loginModal').modal('show');
                            }
                        });
                });
                cardBody.appendChild(btn);
                cardBody.insertAdjacentHTML('beforeend',
                    `<div class="custom-control custom-checkbox float-left">
                           <input type="checkbox" class="custom-control-input" id="cb${task.id}"${task.completed ? ' checked' : ''}>
                           <label class="custom-control-label" for="cb${task.id}">set completed</label>
                       </div>`);
                cardBody.lastElementChild.firstElementChild.addEventListener('click', function(e){
                    postData('/tasks/update/', `id=${task.id}&completed=${Number(this.checked)}`)
                        .then(response => {
                            if(response.success) {
                                fireToast(response.text);
                                state.RequestData();
                            } else {
                                fireToast(response.text);
                                this.checked = !this.checked;
                            }
                        });
                });
            } else {
                let p = Object.assign(document.createElement('p'), {className: 'card-text'});
                p.innerText = text.textContent;
                cardBody.appendChild(p);
                cardBody.insertAdjacentHTML('beforeend', `<span class="badge badge-pill badge-secondary">${task.completed ? 'Done' : 'Uncompleted'}</span>`);
            }
            card.appendChild(cardBody);
            Reveal(card, i);
            _cardWrapper.appendChild(card);
        });
    };
    let _cardWrapper = document.getElementById('cardsWrapper');
    let _pagination = Pagination(document.getElementById('pagination'), OnPageChanged);
    let _sort = Sort(state.RequestData);
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

function fireToast(massage){
    let t = $('#apptoast');
    t.find(".toast-body").text(massage);
    t.toast('show');
}

function deleteAllCookies(){
    document.cookie.split(";").forEach(cookie => {
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 2000 00:00:00 GMT";
    });
}

window.addEventListener('load', function(){
    let tasksManager = TasksManager();
    tasksManager.RequestData();
    window.lbtn = new ButtonInOut(() => tasksManager.RequestData());
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    let validation = Array.prototype.filter.call(forms, function(form){
        form.addEventListener('submit', function(event){
            event.preventDefault();
            event.stopPropagation();
            if(form.checkValidity() === true) {
                switch(form.id){
                    case 'new_task':
                        postData('/tasks/add', $(form).serialize())
                            .then(data => {
                                if(data.success) {
                                    tasksManager.RequestData();
                                    fireToast("Success, task added!");
                                    $('#collapseOne').collapse('hide');
                                    form.classList.remove('was-validated');
                                    $(form).find("input[type=text], input[type=email], textarea").val("");
                                }
                            });
                        break;
                    case 'loginForm':
                        postData('/login', $(form).serialize())
                            .then(data => {
                                if(data.success) {
                                    $('#validationServer05').removeClass('is-invalid');
                                    localStorage.isAdmin = true;
                                    lbtn.update();
                                    fireToast("ADMIN IN DA HOUSE!");
                                    tasksManager.RequestData();
                                    $('#loginModal').modal('hide');
                                    form.classList.remove('was-validated');
                                    $(form).find("input[type=text], input[type=password]").val("");
                                } else {
                                    $('#validationServer05').addClass('is-invalid');
                                }
                            });
                        break;
                }
            } else {
                form.classList.add('was-validated');
            }
        }, false);
    });
}, false);