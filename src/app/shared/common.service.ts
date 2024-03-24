import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public editSub: BehaviorSubject<any> = new BehaviorSubject({});
  public updateList: BehaviorSubject<any> = new BehaviorSubject({});
  constructor() {}
  localStorageKey = 'items';

  saveToLocalStorage(items: any[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
  }

  getFromLocalStorage(): any[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  createItem(item: any) {
    const items = this.getFromLocalStorage();
    item.id = items.length + 1 * 2000;
    items.push(item);
    this.saveToLocalStorage(items);
  }

  updateItem(updatedItem: any) {
    const items = this.getFromLocalStorage();
    const index = items.findIndex(
      (item: { id: any }) => item.id === updatedItem.id
    );
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveToLocalStorage(items);
    } else {
      this.createItem(updatedItem);
    }
  }

  deleteItem(itemId: any) {
    let items = this.getFromLocalStorage();
    items = items.filter((item: { id: any }) => item.id !== itemId);
    this.saveToLocalStorage(items);
  }
}
