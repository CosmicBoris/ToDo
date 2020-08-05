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

const fireToast = massage => {
    let t = $('#apptoast');
    t.find(".toast-body").text(massage);
    t.toast('show');
};

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

const formToQueryString = form => {
    let props = [];
    new FormData(form).forEach((value, key) => {
        props.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return props.join('&');
};

export {getData, postData, fireToast, createElement, formToQueryString};