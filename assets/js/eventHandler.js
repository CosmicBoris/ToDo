/**
 * @class EventHandler
 *
 * My implementation of Observer(Observable)
 * P.S. name reference to C#
 */
export default class EventHandler {
    constructor(){
        this._listeners = [];
    }

    on(listener){
        if(listener && this._listeners.indexOf(listener) === -1)
            this._listeners.push(listener);
        return this;
    }

    off(listener){
        let index = this._listeners.indexOf(listener);
        if(index !== -1)
            this._listeners.splice(index, 1);
        return this;
    }

    notify(sender, args){
        for(let i = 0; i < this._listeners.length; i++)
            this._listeners[i](sender, args);
    }
}