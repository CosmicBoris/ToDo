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

export default Sort;