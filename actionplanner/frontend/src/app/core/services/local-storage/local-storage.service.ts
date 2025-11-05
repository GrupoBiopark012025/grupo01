import { inject, Injectable, signal } from '@angular/core';
import { WINDOW } from "@core/injection-tokens/injection-tokens";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private prefix = 'ap_';

  private _state = signal<Record<LocalStorageKey, any>>({} as any);
  state = this._state.asReadonly();

  private readonly window = inject(WINDOW);

  constructor() {
    this.atualizarState()
  }

  get<T = string>(key: LocalStorageKey): T | null {
    const value = this.window.localStorage.getItem(this.prefix + key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  set<T = any>(key: LocalStorageKey, value: T): void {
    this.window.localStorage.setItem(this.prefix + key, JSON.stringify(value ?? null));
    this.atualizarState();
  }

  remove(key: LocalStorageKey): void {
    this.window.localStorage.removeItem(this.prefix + key);
    this.atualizarState();
  }

  clear() {
    (Object.values(LocalStorageKey) as LocalStorageKey[]).forEach((key) => this.remove(key));
  }

  private atualizarState(): void {
    let values: Partial<Record<LocalStorageKey, any>> = {};
    (Object.keys(LocalStorageKey) as LocalStorageKey[]).forEach((key) => values[key] = this.get(key));
    this._state.update((prev) => ({ ...prev, ...values }));
  }
}

export enum LocalStorageKey {
  AccessToken = 'access_token',
  SessionData = 'session_data'
}
