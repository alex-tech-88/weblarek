import { IProduct } from '../../types';

export class Basket {
    protected _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    add(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this._items.push(item);
        }
    }

    remove(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    clear(): void {
        this._items = [];
    }

    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}
