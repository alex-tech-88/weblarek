import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
}