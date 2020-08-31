import {applyStyles, createElement} from "./util.js";

const css = `
.sort-ctr {
    position: relative;
    display: inline-block;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    height: auto;
    max-width: 300px;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    z-index: 5;
}
.sort-ctr:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    height: 100%;
}
.sort-ctr__btn-trigger,
.sort-ctr__btn-direction {
    position: relative;
    vertical-align: middle;
}
.sort-ctr__btn-trigger {
    display: inline-block;
    background-color: transparent;
    border: none;
    color: black;
    cursor: pointer;
    font-family: 'Lato', sans-serif;
    font-size: 1em;
    margin: 0;
    padding: 0;
    padding-right: .25rem;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
}
.sort-ctr__btn-trigger::-moz-focus-inner {
    border: 0;
    padding: 0;
}
.sort-ctr__btn-trigger:focus {
    outline: none;
    outline-offset: -4px;
}
.sort-ctr__btn-trigger span::after {
    content: attr(data-c);
    margin-left: .5rem;
    text-decoration: underline;
}
.sort-ctr__btn-direction {
    display: inline-block;
    height: 21px;
    width: 21px;
}
.sort-ctr__btn-direction span{
    top: 50%;
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -o-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}
.sort-ctr__btn-direction span,
.sort-ctr__btn-direction span:before,
.sort-ctr__btn-direction span:after {
    position: absolute;
    display: block;
    height: 2px;
    width: .75em;
    background: #1c1c1c;
    opacity: 1;
    pointer-events: none;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
}
.sort-ctr__btn-direction span:before,
.sort-ctr__btn-direction span:after {
    content: '';
    top: 0;
    left: 0;
}
.sort-ctr__btn-direction span:before{
    transform: translateY(-.35em);
}
.sort-ctr__btn-direction span:after{
    transform: translateY(.35em);
}
.sort-ctr__btn-direction[data-d="a"] span:before {
    width: .5em;
}
.sort-ctr__btn-direction[data-d="a"] span:after {
    width: 1em;
}
.sort-ctr__btn-direction[data-d="d"] span:before {
    width: 1em;
}
.sort-ctr__btn-direction[data-d="d"] span:after {
    width: .5em;
}
.sort-ctr__list {
    --height: 0;
    list-style: none;
    position: absolute;
    top: 101%;
    left: 0;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    width: 100%;
    max-height: 0;
    padding: .5em 1em;
    pointer-events: auto;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;
    transition: opacity .3s 0.1s, visibility 0s 0.4s, max-height .4s, box-shadow .3s;
    transition-timing-function: cubic-bezier(.67,.17,.32,.95);
}
.sort-ctr_expanded .sort-ctr__list {
    transition-delay: 0s;
    visibility: visible;
    opacity: 1;
    max-height: var(--height);
}
.sort-ctr__li{
    color: black;
    -webkit-transition: opacity .3s;
    -moz-transition: opacity .3s;
    -o-transition: opacity .3s;
    transition: opacity .3s;
}
.sort-ctr__list:hover li:not(:hover){
    opacity: .7;
}`;

const template = `
<nav class="sort-ctr">
    <button class="sort-ctr__btn-trigger">
        <span>sort by:</span>
    </button>
    <div class="sort-ctr__btn-direction">
        <span></span>
    </div>
    <ul class="sort-ctr__list"></ul>
</nav>`;

const directions = {ASC: 'a', DESC: 'd'};

const DropdownSort = params => {
    const DOM = Object.create(null),
        getDir = _ => localStorage.sortDir || directions.DESC,
        setDir = v => {
            DOM.btnDirection.setAttribute('data-d', v);
            localStorage.sortDir = v;
        },
        getOrder = _ => localStorage.sort || '',
        setOrder = v => localStorage.sort = v,
        setCurrent = item => {
            DOM.valueHolder.setAttribute('data-c', item.textContent);
            setOrder(item.dataset.v);
        },
        setItems = items => {
            while(DOM.itemsHolder.firstChild)
                DOM.itemsHolder.removeChild(DOM.itemsHolder.firstChild);

            let stored = getOrder(),
                match = false,
                fragment = document.createDocumentFragment();
            for(let k in items){
                let li = createElement('li', {class: "sort-ctr__li", 'data-v': k}, items[k]);
                if(stored === k) {
                    setCurrent(li);
                    match = true;
                }
                fragment.appendChild(li);
            }
            DOM.itemsHolder.appendChild(fragment);

            if(!match)
                setCurrent(DOM.itemsHolder.firstChild);
        };

    function onClick(e){
        if(e.target === DOM.btnDirection) {
            setDir(getDir() === directions.DESC ? directions.ASC : directions.DESC);
            params.callback && params.callback();
        } else if(e.target.tagName === 'LI' && e.target.dataset.v !== getOrder()) {
            console.log("item click");
            setCurrent(e.target);
            params.callback && params.callback();
        } else {
            this.classList.toggle('sort-ctr_expanded');
        }
    }

    function onOutOfFocus(e){
        this.classList.remove('sort-ctr_expanded');
    }

    function init(){
        applyStyles(css);

        let tmp = document.createElement('div');
        tmp.innerHTML = template;
        DOM.element = tmp.firstElementChild;
        DOM.valueHolder = DOM.element.firstElementChild.firstElementChild;
        DOM.btnDirection = tmp.querySelector('.sort-ctr__btn-direction');
        DOM.btnDirection.setAttribute('data-d', getDir());
        DOM.itemsHolder = tmp.querySelector('.sort-ctr__list');

        initEvents();

        if(params.container)
            document.body.querySelector(params.container).appendChild(DOM.element);

        if(params.items)
            setItems(params.items);
    }

    function initEvents(){
        DOM.element.onclick = e => {
            let styles = window.getComputedStyle(DOM.itemsHolder, null),
                padding = parseInt(styles.getPropertyValue('padding-top'))
                    + parseInt(styles.getPropertyValue('padding-bottom'));
            if(!isNaN(padding))
                DOM.itemsHolder.style.setProperty('--height', DOM.itemsHolder.scrollHeight + padding + 'px');

            DOM.element.onclick = onClick;
            onClick.call(DOM.element, e);
        };

        DOM.element.addEventListener('focusout', onOutOfFocus);
    }

    init();

    return {
        setItems,
        get element(){
            return DOM.element;
        },
        get value(){
            return localStorage.sort ? localStorage.sort + getDir() : '';
        },
        show: _ => DOM.element.style.visibility = "visible",
        hide: _ => DOM.element.style.visibility = "hidden",
        destroy: () => {
            DOM.element.removeEventListener('click', onClick);
            DOM.element.removeEventListener('focusout', onOutOfFocus);
            if(DOM.element.parentElement)
                DOM.element.parentElement.removeChild(DOM.element);
            for(let f in DOM) delete DOM[f];
        }
    };
};

export default DropdownSort;