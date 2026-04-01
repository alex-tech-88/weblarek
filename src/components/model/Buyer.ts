import { IBuyer, TPayment, FormErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    protected _payment: TPayment | '' = '';
    protected _address: string = '';
    protected _email: string = '';
    protected _phone: string = '';

    constructor(protected events: IEvents) { }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this._payment = value as TPayment;
        } else {
            (this as Record<string, unknown>)[`_${field}`] = value;
        }
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
            address: this._address,
            email: this._email,
            phone: this._phone,
        };
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('buyer:changed');
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        if (!this._payment) errors.payment = 'Не выбран вид оплаты';
        if (!this._address) errors.address = 'Укажите адрес доставки';
        if (!this._email) errors.email = 'Укажите email';
        if (!this._phone) errors.phone = 'Укажите телефон';
        return errors;
    }
}