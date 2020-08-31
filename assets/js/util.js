async function getData(url = ''){
    const response = await fetch(url, {
        method: 'GET',
        headers: {"X-Requested-With": "XMLHttpRequest"}
    });
    return await response.json();
}

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
}

const createSVGElement = (attributes, symbolId) => {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    for(const attr in attributes)
        if(attributes.hasOwnProperty(attr))
            svg.setAttributeNS(null, attr, attributes[attr]);

    if(symbolId) {
        let useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${symbolId}`);
        svg.appendChild(useEl);
    }

    return svg;
}

const applyStyles = (css) => {
    const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';

    if(style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

const formToObject = form => Array.from(new FormData(form)).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
}, {});

const formToQueryString = form => {
    let props = [];
    new FormData(form).forEach((value, key) => {
        props.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return props.join('&');
}

export {getData, postData, createElement, createSVGElement, applyStyles, formToObject, formToQueryString}
