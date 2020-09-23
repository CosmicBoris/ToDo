import {createElement, createSVGElement, createUseElement} from "./util.js";
import Dropdown from "./dropdown.js";

let pathLength = null;

export default class TaskCard {
    constructor({id, title, content, completed, date}){
        this.element =
            createElement('div', {class: 'task-card mb-2', 'data-id': id},
                createElement('div', {class: 'task-card__left'},
                    createElement('input', {class: "task-card__cbox", name: "state", type: "checkbox"}),
                    createElement('label', {for: "state"}),
                    createSVGElement({class: "task-card__toggle"})),
                createElement('div', {class: 'card-body'},
                    createElement('h4', {class: 'card-title'}, title),
                    createElement('p', {class: 'card-text', contenteditable: 'true'}, content),
                    createElement('span', {class: 'badge badge-secondary'}, new Date(date).toLocaleString("en-GB", {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                            hour12: false
                        }
                    ))),
                createElement('div', {class: 'task-card__options dropdown'},
                    createElement('button', {class: 'btn-options dropdown__trigger'},
                        createSVGElement({class: 'icon'}, 'icon-options')),
                    createElement('ul', {class: 'dropdown__list'},
                        createElement('li', {class: 'dropdown__item', 'data-hint': 'share(not implemented)'}, '📤'),
                        createElement('li', {class: 'dropdown__item', 'data-hint': 'delete'}, '🗑'),
                    )));

        this.optionsDropdown = new Dropdown(this.element.querySelector('.dropdown'));


        if(completed) {
            let useEl = createUseElement('checkmark');
            this.element.querySelector('.task-card__toggle').appendChild(useEl);
            this.element.querySelector('.task-card__cbox').checked = true;

            if(!pathLength) {
                let symbol = document.querySelector(useEl.getAttribute('xlink:href'));
                pathLength = symbol.firstElementChild.getTotalLength();
            }

            /*this._svgUse.style.strokeDasharray = pathLength;
            this._svgUse.style.strokeDashoffset = Math.floor(pathLength) - 1;*/
        }

        this.initEvents();
    }

    initEvents(){
        this._onStateChange = e => {

        };

        this.element.querySelector('.card-text').addEventListener('focusout', e => {});
    }
}