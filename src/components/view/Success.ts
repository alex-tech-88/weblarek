import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, formatPrice } from '../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected descriptionEl: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton   = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.descriptionEl.textContent = `Списано ${formatPrice(value)} синапсов`;
    }
}