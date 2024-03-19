export class QueryQueue {
    queue: Map<string, Function>;
    running: boolean;
    constructor() {
        this.queue = new Map();
        this.running = false;
    }

    public add(key: string, func: Function) {
        this.queue.
    }

    private addSequential() {
        
    }
}