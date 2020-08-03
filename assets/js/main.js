'use strict';

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
        this.btn.innerText = localStorage.isAdmin ? 'Sign Out' : 'Login';
    }
}

const Pagination = (container, callback) => {
    const update = _ => {
        while(ul.firstChild)
            ul.removeChild(ul.firstChild);

        if(_pagesCount < 2) return;

        for(let i = 1; i <= _pagesCount; i++)
            ul.insertAdjacentHTML('beforeend',
                `<li class="page-item${i === _currentPage ? ' active' : ''}"><a class="page-link">${i}</a></li>`);
    };
    const onClick = e => {
        e.preventDefault();
        let page = parseInt(e.target.innerText);
        if(_currentPage !== page) {
            _currentPage = page;
            update();
            if(typeof callback === 'function')
                callback(_currentPage);
        }
    };

    let _pagesCount = 0,
        _currentPage = 1,
        ul = createElement("ul", {class: "pagination justify-content-center"});

    ul.addEventListener('click', onClick, false);
    container.appendChild(ul);

    return {
        show: _ => ul.style.visibility = "visible",
        hide: _ => ul.style.visibility = "hidden",
        set setPages(value){
            _pagesCount = value;
            update();
        },
        get currentPage(){ return _currentPage }
    };
};

const Sort = callback => {
    const ACTIVE_CLASS = 'active';
    let _itemsHolder = null;

    function onItemClick(e){
        let val = e.target.getAttribute('data-rule');
        if(localStorage.sort !== val) {
            localStorage.sort = val;
            _itemsHolder.querySelector("button.active").classList.remove(ACTIVE_CLASS);
            e.target.classList.add(ACTIVE_CLASS);
            callback && callback();
        }
    }

    function init(){
        _itemsHolder = document.getElementById("dropdownItemsHolder");
        if(localStorage.sort) {
            let item = _itemsHolder.querySelector(`button[data-rule="${localStorage.sort}"]`);
            if(item) {
                _itemsHolder.querySelector("button." + ACTIVE_CLASS).classList.remove(ACTIVE_CLASS);
                item.classList.add(ACTIVE_CLASS);
            }
        } else {
            let item = _itemsHolder.querySelector("button." + ACTIVE_CLASS);
            localStorage.sort = item.getAttribute('data-rule');
        }
        initEvents();
    }

    function initEvents(){
        _itemsHolder.addEventListener('click', onItemClick, false);
    }

    init();

    return {
        show: _ => _itemsHolder.parentElement.style.visibility = "visible",
        hide: _ => _itemsHolder.parentElement.style.visibility = "hidden",
        get order(){ return localStorage.sort || '';}
    };
};

const tasksManager = new TasksManager();
const btnLogin = new ButtonInOut(_ => tasksManager.requestData());
tasksManager.start();