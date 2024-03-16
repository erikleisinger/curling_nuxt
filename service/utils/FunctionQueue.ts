export class FunctionQueue {
    constructor() {
      this.queue = [];
      this.running = false;
    }
  
    add(func) {
      this.queue.push(func);
      if (!this.running) {
        this.executeNext();
      }
    }
  
    async executeNext() {
      if (this.queue.length === 0) {
        this.running = false;
        return;
      }
  
      this.running = true;
      const nextFunc = this.queue.pop();
      await nextFunc();
      this.executeNext();
    }
  }