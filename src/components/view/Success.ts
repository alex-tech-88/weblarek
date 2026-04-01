import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _description: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this._closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}