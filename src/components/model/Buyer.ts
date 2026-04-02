import { IBuyer, TPayment, FormErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    protected payment: TPayment | '' = '';
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor(protected events: IEvents) {}

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = value as TPayment;
        } else {
            (this as Record<string, unknown>)[field] = value;
        }
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            address: this.address,
            email:   this.email,
            phone:   this.phone,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.email   = '';
        this.phone   = '';
        this.events.emit('buyer:changed');
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address) errors.address = 'Укажите адрес доставки';
        if (!this.email)   errors.email   = 'Укажите email';
        if (!this.phone)   errors.phone   = 'Укажите телефон';
        return errors;
    }
}