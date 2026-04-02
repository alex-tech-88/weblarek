import { IApi, IProduct, IOrder, IOrderResult } from '../types';

export class LarekApi {
    private api: IApi;
    private cdn: string;

    constructor(api: IApi, cdn: string) {
        this.api = api;
        this.cdn = cdn;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api
            .get<{ total: number; items: IProduct[] }>('/product/')
            .then(data =>
                data.items.map(product => ({
                    ...product,
                    image: this.cdn + product.image,
                }))
            );
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}