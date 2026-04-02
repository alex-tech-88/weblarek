import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

type TCardCatalog = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

interface ICardActions {
    onClick: () => void;
}

export class CardCatalog extends Card<TCardCatalog> {
    protected categoryEl: HTMLElement;
    protected imageEl: HTMLImageElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.categoryEl = container.querySelector('.card__category')!;
        this.imageEl    = container.querySelector('.card__image')!;
        container.addEventListener('click', actions.onClick);
    }

    set category(value: string) {
        this.categoryEl.textContent = value;
        Object.values(categoryMap).forEach(cls =>
            this.categoryEl.classList.remove(cls)
        );
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) this.categoryEl.classList.add(modifier);
    }

    set image(value: string) {
        this.setImage(this.imageEl, value, this.titleEl?.textContent ?? '');
    }
}