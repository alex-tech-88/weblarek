import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ address: string; payment: string }> {
    protected _onlineButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._onlineButton = container.querySelector('[name="card"]')!;
        this._cashButton   = container.querySelector('[name="cash"]')!;

        this._onlineButton.addEventListener('click', () => {
            this.events.emit('order:change', { field: 'payment', value: 'online' });
        });
        this._cashButton.addEventListener('click', () => {
            this.events.emit('order:change', { field: 'payment', value: 'cash' });
        });
    }

    set payment(value: 'online' | 'cash') {
        this._onlineButton.classList.toggle('button_alt-active', value === 'online');
        this._cashButton.classList.toggle('button_alt-active',  value === 'cash');
    }
}