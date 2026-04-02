import { Card } from './Card';
import { IProduct } from '../../types';

type TCardBasket = Pick<IProduct, 'title' | 'price'> & { index: number };

interface ICardActions {
    onClick: () => void;
}

export class CardBasket extends Card<TCardBasket> {
    protected indexEl: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.indexEl      = container.querySelector('.basket__item-index')!;
        this.deleteButton = container.querySelector('.basket__item-delete')!;
        this.deleteButton.addEventListener('click', actions.onClick);
    }

    set index(value: number) {
        this.indexEl.textContent = String(value);
    }
}