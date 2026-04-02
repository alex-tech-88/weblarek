import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IForm {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T extends object> extends Component<IForm> {
    protected submitButton: HTMLButtonElement;
    protected errorsEl: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsEl     = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.name) {
                this.events.emit(`${this.container.name}:change`, {
                    field: target.name as keyof T,
                    value: target.value,
                });
            }
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string[]) {
        this.errorsEl.textContent = value.join('. ');
    }
}