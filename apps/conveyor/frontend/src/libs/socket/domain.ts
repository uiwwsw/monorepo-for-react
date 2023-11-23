export type Trigger<T> = (data: T) => unknown;
export class SocketSubscript<K, T> {
  private name: K;
  get strName() {
    return `${this.name}`;
  }
  trigger: Trigger<T>;
  constructor(name: K, trigger: Trigger<T>) {
    this.name = name;
    this.trigger = trigger;
  }
}
