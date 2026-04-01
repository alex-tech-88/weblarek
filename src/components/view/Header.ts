import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected _basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }
}