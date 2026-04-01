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
const cardCatalogTemplate  = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate  = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate   = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate       = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate        = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate     = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate      = ensureElement<HTMLTemplateElement>('#success');

// View
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView  = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm   = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

// =============================================
// Презентер — подписки на события
// =============================================

// Каталог загружен → рендерим карточки в галерею
events.on('catalog:changed', () => {
    const cards = productsModel.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render(item);
    });
    gallery.render({ catalog: cards });
    header.render({ counter: basketModel.getCount() });
});

// Клик по карточке → открываем превью
events.on('card:select', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basketModel.hasItem(item.id)) {
                events.emit('basket:remove', { id: item.id });
            } else {
                events.emit('basket:add', item);
            }
            modal.close();
        },
    });
    modal.render({
        content: card.render({ ...item, inBasket: basketModel.hasItem(item.id) }),
    });
});

// Добавить товар в корзину
events.on('basket:add', (item: IProduct) => {
    basketModel.add(item);
});

// Удалить товар из корзины
events.on('basket:remove', (data: { id: string }) => {
    basketModel.remove(data.id);
});

// Обновить счётчик и содержимое корзины
events.on('basket:changed', () => {
    header.render({ counter: basketModel.getCount() });
    const items = basketModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', { id: item.id }),
        });
        return card.render({ ...item, index: index + 1 });
    });
    basketView.render({ items, total: basketModel.getTotal() });
});

// Открыть корзину
events.on('basket:open', () => {
    const items = basketModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', { id: item.id }),
        });
        return card.render({ ...item, index: index + 1 });
    });
    modal.render({
        content: basketView.render({ items, total: basketModel.getTotal() }),
    });
});

// Начать оформление заказа
events.on('order:start', () => {
    buyerModel.clear();
    modal.render({
        content: orderForm.render({ valid: false, errors: [] }),
    });
});

// Изменение поля в форме заказа (адрес / способ оплаты)
events.on('order:change', (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setField(data.field, data.value);
    const errs = buyerModel.validate();
    orderForm.render({
        valid: !errs.payment && !errs.address,
        errors: [errs.payment, errs.address].filter(Boolean) as string[],
    });
    if (data.field === 'payment') {
        orderForm.payment = data.value as 'online' | 'cash';
    }
});

// Переход на второй шаг формы
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({ valid: false, errors: [] }),
    });
});

// Изменение поля в форме контактов
events.on('contacts:change', (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setField(data.field, data.value);
    const errs = buyerModel.validate();
    contactsForm.render({
        valid: !errs.email && !errs.phone,
        errors: [errs.email, errs.phone].filter(Boolean) as string[],
    });
});

// Отправить заказ на сервер
events.on('contacts:submit', () => {
    const order = {
        ...buyerModel.getData(),
        items: basketModel.getItems().map(i => i.id),
        total: basketModel.getTotal(),
    };
    larekApi.createOrder(order)
        .then(result => {
            basketModel.clear();
            buyerModel.clear();
            modal.render({
                content: successView.render({ total: result.total }),
            });
        })
        .catch(err => console.error('Ошибка оформления заказа:', err));
});

// Закрыть окно успеха
events.on('success:close', () => modal.close());

// =============================================
// Загрузка каталога
// =============================================
larekApi.getProducts()
    .then(items => {
        productsModel.setItems(items);
    })
    .catch(err => console.error('Ошибка загрузки каталога:', err));