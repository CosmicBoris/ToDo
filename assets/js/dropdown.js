export default class Dropdown {
    constructor(el){
        this.DOM = {el: el};
        this.DOM.list = el.querySelector('.dropdown__list');
        this.initEvents();
    }

    initEvents(){
        this.onClick = e => {
            this.DOM.el.classList.toggle('dropdown_expanded');
        };

        this.DOM.el.onclick = e => {
            const styles = window.getComputedStyle(this.DOM.list, null),
                padding = parseInt(styles.getPropertyValue('padding-top'))
                    + parseInt(styles.getPropertyValue('padding-bottom'));
            if(!isNaN(padding))
                this.DOM.list.style.setProperty('--height', this.DOM.list.scrollHeight + padding + 'px');

            this.DOM.el.onclick = this.onClick;
            this.onClick.call(this.DOM.el, e);
        };
    }
}