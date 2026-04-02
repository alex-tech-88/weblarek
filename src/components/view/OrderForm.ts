import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ address: string; payment: string }> {
    protected onlineButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.onlineButton = container.querySelector('[name="card"]')!;
        this.cashButton   = container.querySelector('[name="cash"]')!;

        // кнопка заблокирована при создании
        this.submitButton.disabled = true;

        this.onlineButton.addEventListener('click', () => {
            this.events.emit('order:change', { field: 'payment', value: 'online' });
        });
        this.cashButton.addEventListener('click', () => {
            this.events.emit('order:change', { field: 'payment', value: 'cash' });
        });
    }

    set payment(value: 'online' | 'cash') {
        this.onlineButton.classList.toggle('button_alt-active', value === 'online');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}