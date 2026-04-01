import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

type TCardData = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

export abstract class Card<T extends Partial<TCardData>> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement | null;
    protected _image: HTMLImageElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._title    = container.querySelector('.card__title')!;
        this._price    = container.querySelector('.card__price')!;
        this._category = container.querySelector('.card__category');
        this._image    = container.querySelector('.card__image');
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            // сбросить все модификаторы категорий
            Object.values(categoryMap).forEach(cls =>
                this._category!.classList.remove(cls)
            );
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) this._category.classList.add(modifier);
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this._title?.textContent ?? '');
        }
    }
}