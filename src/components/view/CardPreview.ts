import { Card } from './Card';
import { IProduct } from '../../types';

type TCardPreview = Pick<IProduct, 'title' | 'price' | 'category' | 'image' | 'description'> & {
    inBasket: boolean;
};

interface ICardActions {
    onClick: () => void;
}

export class CardPreview extends Card<TCardPreview> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this._description = container.querySelector('.card__text')!;
        this._button = container.querySelector('.card__button')!;
        this._button.addEventListener('click', actions.onClick);
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set inBasket(value: boolean) {
        this._button.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }

    // переопределяем: при null — блокируем кнопку
    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        } else {
            this._button.disabled = false;
        }
    }
}