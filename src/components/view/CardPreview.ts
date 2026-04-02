import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

type TCardPreview = Pick<IProduct, 'title' | 'price' | 'category' | 'image' | 'description'> & {
    inBasket: boolean;
};

export class CardPreview extends Card<TCardPreview> {
    protected categoryEl: HTMLElement;
    protected imageEl: HTMLImageElement;
    protected descriptionEl: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.categoryEl    = container.querySelector('.card__category')!;
        this.imageEl       = container.querySelector('.card__image')!;
        this.descriptionEl = container.querySelector('.card__text')!;
        this.button        = container.querySelector('.card__button')!;

        this.button.addEventListener('click', () => {
            this.events.emit('preview:toggle');
        });
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

    set description(value: string) {
        this.descriptionEl.textContent = value;
    }

    set inBasket(value: boolean) {
        this.button.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.button.disabled    = true;
            this.button.textContent = 'Недоступно';
        } else {
            this.button.disabled = false;
        }
    }
}