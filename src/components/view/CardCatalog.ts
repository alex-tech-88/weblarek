import { Card } from './Card';
import { IProduct } from '../../types';

type TCardCatalog = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

interface ICardActions {
    onClick: () => void;
}

export class CardCatalog extends Card<TCardCatalog> {
    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        container.addEventListener('click', actions.onClick);
    }
}