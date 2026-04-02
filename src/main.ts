import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/model/Products';
import { Basket } from './components/model/Basket';
import { Buyer } from './components/model/Buyer';
import { LarekApi } from './components/LarekApi';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { IProduct, IBuyer } from './types';


// =============================================
// Инициализация инфраструктуры
// =============================================
const events   = new EventEmitter();
const api      = new Api(API_URL);
const larekApi = new LarekApi(api, CDN_URL);


// Модели
const productsModel = new Products(events);
const basketModel   = new Basket(events);
const buyerModel    = new Buyer(events);


// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate  = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate      = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate       = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate    = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate     = ensureElement<HTMLTemplateElement>('#success');


// View — создаются один раз
const header       = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery      = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal        = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardPreview  = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
const basketView   = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm    = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const successView  = new Success(cloneTemplate(successTemplate), events);


// =============================================
// Презентер — подписки на события
// =============================================

// Каталог загружен → рендерим карточки в галерею
events.on('catalog:changed', () => {
    const cards = productsModel.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => productsModel.setPreview(item),
        });
        return card.render(item);
    });
    gallery.render({ catalog: cards });
    header.render({ counter: basketModel.getCount() });
});


// Модель продукта обновилась → открываем превью
events.on('preview:changed', ({ item }: { item: IProduct }) => {
    modal.render({
        content: cardPreview.render({
            ...item,
            inBasket: basketModel.hasItem(item.id),
        }),
    });
});


// Кнопка в превью → добавить/удалить из корзины
events.on('preview:toggle', () => {
    const item = productsModel.getPreview()!;
    if (basketModel.hasItem(item.id)) {
        basketModel.remove(item.id);
    } else {
        basketModel.add(item);
    }
    modal.close();
});


// Корзина изменилась → обновляем счётчик и содержимое
events.on('basket:changed', () => {
    header.render({ counter: basketModel.getCount() });
    const items = basketModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => basketModel.remove(item.id),
        });
        return card.render({ ...item, index: index + 1 });
    });
    basketView.render({ items, total: basketModel.getTotal() });
});


// Открыть корзину — корзина уже актуальна после basket:changed
events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
});


// Начать оформление — НЕ очищаем модель, кнопка заблокирована в конструкторе
events.on('order:start', () => {
    modal.render({ content: orderForm.render() });
});


// Изменение поля → только пишем в модель
// buyer:changed эмитится внутри setField автоматически
events.on('order:change', (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setField(data.field, data.value);
});

events.on('contacts:change', (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setField(data.field, data.value);
});


// Модель покупателя изменилась → обновляем обе формы
events.on('buyer:changed', () => {
    const buyer = buyerModel.getData();
    const errs  = buyerModel.validate();

    orderForm.payment = buyer.payment as 'online' | 'cash';
    orderForm.address = buyer.address;
    orderForm.render({
        valid:  !errs.payment && !errs.address,
        errors: [errs.payment, errs.address].filter(Boolean) as string[],
    });

    contactsForm.email = buyer.email;
    contactsForm.phone = buyer.phone;
    contactsForm.render({
        valid:  !errs.email && !errs.phone,
        errors: [errs.email, errs.phone].filter(Boolean) as string[],
    });
});


// Переход на второй шаг формы
events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
});


// Отправка заказа на сервер
events.on('contacts:submit', () => {
    const order = {
        ...buyerModel.getData(),
        items: basketModel.getItems().map(i => i.id),
        total: basketModel.getTotal(),
    };
    larekApi.createOrder(order)
        .then(result => {
            basketModel.clear();
            buyerModel.clear(); // buyer:changed очистит поля форм автоматически
            modal.render({ content: successView.render({ total: result.total }) });
        })
        .catch(err => console.error('Ошибка оформления заказа:', err));
});


// Закрыть окно успеха
events.on('success:close', () => modal.close());


// =============================================
// Загрузка каталога
// =============================================
larekApi.getProducts()
    .then(items => productsModel.setItems(items))
    .catch(err => console.error('Ошибка загрузки каталога:', err));