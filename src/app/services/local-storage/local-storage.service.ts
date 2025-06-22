import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private sessionIdSubject = new BehaviorSubject<number | null>(null);

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    if (key === 'session_ID')
      this.sessionIdSubject.next(Number(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) as T : null;
    } catch (error) {
      return null
    }
  }

  getSession$() {
    return this.sessionIdSubject.asObservable();
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
