import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list          = ensureElement<HTMLElement>('.basket__list', container);
        this._total         = ensureElement<HTMLElement>('.basket__price', container);
        this._checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._checkoutButton.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(value: HTMLElement[]) {
        if (value.length === 0) {
            this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
            this._checkoutButton.disabled = true;
        } else {
            this._list.replaceChildren(...value);
            this._checkoutButton.disabled = false;
        }
    }

    set total(value: number) {
        this._total.textContent = `${value} синапсов`;
    }
}