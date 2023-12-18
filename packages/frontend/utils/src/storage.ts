export class Storage<K extends string> {
  storage?: globalThis.Storage;
  constructor(storage?: globalThis.Storage) {
    this.storage = storage;
  }
  get<T>(key: K): T | undefined {
    const value = this.storage?.getItem(key);
    if (!value) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  set(key: K, value?: unknown): void {
    if (
      (value instanceof Array && value.length === 0) ||
      (value instanceof Object && Object.keys(value).length === 0) ||
      (typeof value === 'string' && !value) ||
      value === undefined ||
      value === null
    )
      this.storage?.removeItem(key);
    else {
      if (typeof value === 'string') this.storage?.setItem(key, value);
      else this.storage?.setItem(key, JSON.stringify(value));
    }
  }

  clear() {
    this.storage?.clear();
  }

  startWithClear(key: K) {
    if (!this.storage) return [];
    return Object.keys(this.storage)
      .filter((x) => x.startsWith(key))
      .map((x) => this.set(x as K, null));
  }
}
