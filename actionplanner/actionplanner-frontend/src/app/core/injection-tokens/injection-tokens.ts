import { InjectionToken } from "@angular/core";

export const WINDOW = new InjectionToken<Window>('WindowToken', {
  factory: () => {
    if(typeof window !== 'undefined') {
      return window
    }
    return new Window();
  }
});
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
