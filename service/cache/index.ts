export class QueryCache {
    cache: Map<string, V>;
    listeners: Map<string, Map<string, Function>>;
    pending: Map<string, boolean>
    constructor() {
        this.cache = new Map();
        this.listeners = new Map();
        this.pending = new Map();
    }

    has(key: string) {
        return this.cache.has(key)
    }

    get(key: string) {
        return this.cache.get(key)
    }

    set(key: string, value: Function) {
        this.cache.set(key, value)
        this.emitChange(key); // Emit change event after deleting the value
    }

    delete(key: string) {
        this.cache.delete(key)
        this.emitChange(key); // Emit change event after deleting the value
    }

    clear() {
        Object.assign(this.cache, {});
    }

    onChange(queryKey: string, callback: Function, callbackId: string) {
        if (!this.listeners.has(queryKey)) this.listeners.set(queryKey, new Map());
        const queryListeners = this.listeners.get(queryKey);
        queryListeners?.set(callbackId, callback)
    }

    emitChange(key: string) {
        const listeners = this.listeners.get(key)
        if (listeners) {
            listeners.forEach((callback) => callback(this.cache.get(key)));
        }
    }
}

export default new QueryCache();
