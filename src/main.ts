import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Products } from './components/model/Products';
import { Basket } from './components/model/Basket';
import { Buyer } from './components/model/Buyer';
import { LarekApi } from './components/LarekApi';

// --- Тестирование модели Products ---
const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Товар по id:', productsModel.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Несуществующий товар:', productsModel.getProduct('non-existent-id'));
productsModel.setPreview(apiProducts.items[0]);
console.log('Товар для просмотра:', productsModel.getPreview());
productsModel.setPreview(null);
console.log('Сброс просмотра:', productsModel.getPreview());

// --- Тестирование модели Basket ---
const basketModel = new Basket();
console.log('Пустая корзина:', basketModel.getItems());
basketModel.add(apiProducts.items[0]); // 750
basketModel.add(apiProducts.items[1]); // 1450
basketModel.add(apiProducts.items[0]); // дубликат — не добавится
console.log('Корзина (2 товара):', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());
console.log('Итого (2200):', basketModel.getTotal());
console.log('hasItem (true):', basketModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('hasItem (false):', basketModel.hasItem('non-existent'));
basketModel.remove('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('После удаления (1 товар):', basketModel.getItems());
basketModel.clear();
console.log('После очистки:', basketModel.getItems());

// --- Тестирование модели Buyer ---
const buyerModel = new Buyer();
console.log('Ошибки (все пустые):', buyerModel.validate());
buyerModel.setField('payment', 'online');
buyerModel.setField('address', 'Москва, ул. Пушкина, д.1');
console.log('Ошибки (нет email/phone):', buyerModel.validate());
buyerModel.setField('email', 'test@test.ru');
buyerModel.setField('phone', '+71234567890');
console.log('Ошибок нет ({}):', buyerModel.validate());
console.log('Все данные покупателя:', buyerModel.getData());
buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());

// --- Запрос к серверу через LarekApi ---
const api = new Api(API_URL);
const larekApi = new LarekApi(api, CDN_URL);

larekApi.getProducts()
    .then(items => {
        productsModel.setItems(items);
        console.log('Каталог товаров с сервера:', productsModel.getItems());
    })
    .catch(err => console.error('Ошибка загрузки товаров:', err));
