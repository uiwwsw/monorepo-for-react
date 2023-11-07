export class Storage {
  storage?: globalThis.Storage;
  constructor(storage?: globalThis.Storage) {
    this.storage = storage;
  }
  get<T>(key: string): T | null {
    const value = this.storage?.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  set(key: string, value: unknown): void {
    if (value instanceof Array && value.length === 0) this.storage?.removeItem(key);
    else if (value instanceof Object && Object.keys(value).length === 0) this.storage?.removeItem(key);
    else if (typeof value === 'string' && !value) this.storage?.removeItem(key);
    else this.storage?.setItem(key, JSON.stringify(value));
  }

  clear() {
    this.storage?.clear();
  }
}

export const LocalStorage = new Storage(typeof window === 'undefined' ? undefined : localStorage);
export const SessionStorage = new Storage(typeof window === 'undefined' ? undefined : sessionStorage);
