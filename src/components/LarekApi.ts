import { IApi, IProduct, IOrder, IOrderResult } from '../types';

export class LarekApi {
    private _api: IApi;
    private _cdn: string;

    constructor(api: IApi, cdn: string) {
        this._api = api;
        this._cdn = cdn;
    }

    getProducts(): Promise<IProduct[]> {
        return this._api
            .get<{ total: number; items: IProduct[] }>('/product/')
            .then(data =>
                data.items.map(product => ({
                    ...product,
                    image: this._cdn + product.image,
                }))
            );
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}
