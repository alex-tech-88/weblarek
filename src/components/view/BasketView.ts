import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, formatPrice } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected listEl: HTMLElement;
    protected totalEl: HTMLElement;
    protected checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listEl         = ensureElement<HTMLElement>('.basket__list', container);
        this.totalEl        = ensureElement<HTMLElement>('.basket__price', container);
        this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.checkoutButton.disabled = true;

        this.checkoutButton.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(value: HTMLElement[]) {
        this.listEl.replaceChildren(...value);
        this.checkoutButton.disabled = value.length === 0;
    }

    set total(value: number) {
        this.totalEl.textContent = `${formatPrice(value)} синапсов`;
    }
}