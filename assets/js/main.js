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
                        deleteAllCookies();
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

async function postData(url = '', data){
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data
    });
    return await response.json();
}

async function getData(url = ''){
    const response = await fetch(url, {
        method: 'GET',
        headers: {"X-Requested-With": "XMLHttpRequest"}
    });
    return await response.json();
}

const createElement = (name, attributes, ...children) => {
    let node = document.createElement(name);
    for(const attr in attributes)
        if(attributes.hasOwnProperty(attr))
            node.setAttribute(attr, attributes[attr]);
    children.forEach(child => {
        if(typeof child !== 'string') node.appendChild(child);
        else node.appendChild(document.createTextNode(child));
    });
    return node;
};

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

const formToQueryString = form => {
    let props = [];
    new FormData(form).forEach((value, key) => {
        props.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return props.join('&');
};

const tasksManager = new TasksManager();
const btnLogin = new ButtonInOut(() => tasksManager.requestData());

(function ready(){
    return new Promise(resolve => {
        function isReady(){
            if(document.readyState !== 'loading') resolve();
        }

        document.addEventListener('readystatechange', isReady);
        isReady();
    });
}()).then(tasksManager.start.bind(tasksManager));