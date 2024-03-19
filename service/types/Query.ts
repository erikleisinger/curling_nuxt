import throttle from 'lodash.throttle'
export class Query {
    value: Promise<any>;
    key: string;
    queryFunc: Function;
    constructor(key: string, queryFunc: Function) {
        this.value = Promise.resolve(null);
        this.key = key;
        this.queryFunc = queryFunc;
    }

    public run = throttle(() => {
        this.value = this.queryFunc();
    }, 1)
}