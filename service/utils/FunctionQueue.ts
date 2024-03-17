export class FunctionQueue {
    constructor() {
      this.queue = [];
      this.running = false;
    }
  
    async add(func) {
      this.queue.push(func);
      if (!this.running) {
        await this.executeNext();
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