import { InjectionToken } from "@angular/core";

export const WINDOW = new InjectionToken<Window & typeof globalThis>('Window');
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
