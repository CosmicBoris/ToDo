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
        if(child) {
            if(typeof child !== 'string') node.appendChild(child);
            else node.appendChild(document.createTextNode(child));
        }
    });
    return node;
}

const createUseElement = id => {
    let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`);
    return use;
}

const createSVGElement = (attributes, symbolId) => {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    for(const attr in attributes)
        if(attributes.hasOwnProperty(attr))
            svg.setAttributeNS(null, attr, attributes[attr]);

    if(symbolId) {
        svg.appendChild(createUseElement(symbolId));
    }

    return svg;
}

const applyStyles = css => {
    document.head.appendChild(document.createElement('style')).textContent = css;
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

export {
    getData,
    postData,
    createElement,
    createSVGElement,
    createUseElement,
    applyStyles,
    formToObject,
    formToQueryString
}