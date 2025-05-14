export class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    subscribe(event, fn) {
        (this.listeners[event] ||= []).push(fn);
    }
    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }
}
