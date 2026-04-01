import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
        this.events.emit('modal:close');
    }

    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}