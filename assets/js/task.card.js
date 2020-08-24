import {createElement, createSVGElement} from "./util.js";

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
                    createElement('p', {class: 'card-text'}, content),
                    createElement('span', {class: 'badge badge-secondary'},
                        new Date(date).toLocaleString("en-GB", {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: 'numeric', minute: 'numeric', second: 'numeric',
                                hour12: false
                            }
                        ))),
                createElement('button', {class: 'task-card__options'},
                    createSVGElement({class: "icon"}, 'icon-options')));


        if(completed) {
            this._svgUse = this.element.querySelector('.task-card__toggle use');

            if(!pathLength) {
                let symbol = document.querySelector(this._svgUse.getAttribute('xlink:href'));
                pathLength = symbol.firstElementChild.getTotalLength();
            }

            this._svgUse.style.strokeDasharray = pathLength;
            this._svgUse.style.strokeDashoffset = Math.floor(pathLength) - 1;
        }
    }

    initEvents(){
        this._onStateChange = e => {

        };


    }
}