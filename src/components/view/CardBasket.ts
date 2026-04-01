import { Card } from './Card';
import { IProduct } from '../../types';

type TCardBasket = Pick<IProduct, 'title' | 'price'> & { index: number };

interface ICardActions {
    onClick: () => void;
}

export class CardBasket extends Card<TCardBasket> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this._index = container.querySelector('.basket__item-index')!;
        this._deleteButton = container.querySelector('.basket__item-delete')!;
        this._deleteButton.addEventListener('click', actions.onClick);
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}