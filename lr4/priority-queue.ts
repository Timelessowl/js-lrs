import * as Tools from "./tools.js";

type QueueEntry<T> = {
  value: T;
  priority: number;
};

class PriorityQueue<T> {
  private values: QueueEntry<T>[] = [];

  enqueue(value: T, priority: number): void {
    this.values.push({ value, priority });
    Tools.reorderUp(
      this.values,
      this.values.length - 1,
      (first, second) => first.priority > second.priority,
    );
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;

    const result = this.values[0].value;
    const end = this.values.length - 1;
    [this.values[0], this.values[end]] = [this.values[end], this.values[0]];
    Tools.reorderDown(
      this.values,
      0,
      end,
      (first, second) => first.priority > second.priority,
    );
    this.values.pop();
    return result;
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }
}

const queue = new PriorityQueue<string>();
queue.enqueue("задача c приоритетом 1", 1);
queue.enqueue("задача c приоритетом 3", 3);
queue.enqueue("задача c приоритетом 42", 42);

while (!queue.isEmpty()) {
  console.log("Извлечена", queue.dequeue());
}
