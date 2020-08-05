import {createElement} from "./util.js";

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

export default Pagination;