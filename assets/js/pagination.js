import {createElement} from "./util.js";

const Pagination = (container, callback) => {
    const update = _ => {
        while(_ul.firstChild)
            _ul.removeChild(_ul.firstChild);

        if(_pagesCount < 2) return;

        for(let i = 1; i <= _pagesCount; i++)
            _ul.insertAdjacentHTML('beforeend',
                `<li class="page-item${i === _currentPage ? ' active' : ''}"><a class="page-link">${i}</a></li>`);
    };
    const onClick = e => {
        e.preventDefault();
        let page = +e.target.innerText;
        if(_currentPage !== page) {
            _currentPage = page;
            update();
            if(typeof callback === 'function')
                callback(_currentPage);
        }
    };

    let _pagesCount = 0,
        _currentPage = 1,
        _ul = createElement("ul", {class: "pagination justify-content-center"});
    _ul.addEventListener('click', onClick, false);
    container.appendChild(_ul);

    return {
        show: _ => _ul.style.visibility = "visible",
        hide: _ => _ul.style.visibility = "hidden",
        set setPage(value){
            _pagesCount = value;
            update();
        },
        get current(){ return _currentPage }
    };
};

export default Pagination;