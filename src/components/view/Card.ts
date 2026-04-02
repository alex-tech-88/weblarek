import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { formatPrice } from '../../utils/utils';

type TCardBase = Pick<IProduct, 'title' | 'price'>;

export abstract class Card<T extends Partial<TCardBase>> extends Component<T> {
    protected titleEl: HTMLElement;
    protected priceEl: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleEl = container.querySelector('.card__title')!;
        this.priceEl = container.querySelector('.card__price')!;
    }

    set title(value: string) {
        this.titleEl.textContent = value;
    }

    set price(value: number | null) {
        this.priceEl.textContent = value !== null
            ? `${formatPrice(value)} синапсов`
            : 'Бесценно';
    }
}