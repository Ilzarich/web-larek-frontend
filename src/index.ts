import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardBasket, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order, Сontacts } from './components/Order';
import { IOrderForm, IProduct } from './types';
import { Success } from './components/common/Success';

const emitter = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

emitter.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const successTpl = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTpl = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTpl = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTpl = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTpl = ensureElement<HTMLTemplateElement>('#basket');
const orderTpl = ensureElement<HTMLTemplateElement>('#order');
const contactsTpl = ensureElement<HTMLTemplateElement>('#contacts');


const appData = new AppData({}, emitter);

const page = new Page(document.body, emitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), emitter)

const basket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTpl), emitter);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTpl), emitter);
const contacts = new Сontacts(cloneTemplate<HTMLFormElement>(contactsTpl), emitter);

const success = new Success(cloneTemplate(successTpl), {
  onClick: () => {
    modal.close(); 
    emitter.emit('basket:clear')
  }
})

emitter.on('basket:clear', () => {
  appData.clearBasket();  
  emitter.emit('basket:updateCounter')
  emitter.emit('basket:change')
});

let clearBasketOnClose = false;

emitter.on('basket:updateCounter', () => {
  page.counter = appData.bskt.length
})

emitter.on('items:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTpl), {
      onClick: () => emitter.emit('card:select', item) 
    });
    return card.render({
      title: item.title,
      category: item.category,
      image: api.cdn + item.image,
      price: item.price
    });
  })
})

emitter.on('card:select', (item: IProduct) => {
  appData.setPreview(item); 
});

emitter.on('preview:changed', (item: IProduct) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTpl), {
    onClick: () => emitter.emit('card:add', item)
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: api.cdn + item.image,
      text: item.description,
      price: item.price,
      category: item.category
    })
  });
});


emitter.on('card:add', (item: IProduct) => {
  if(item.price !== null) {
    appData.addToOrder(item);
    appData.setProductToBasket(item);
    emitter.emit('basket:updateCounter');
    emitter.emit('basket:change')
    modal.close();
  } else {
    emitter.emit('Невозможно добавить товар без цены в корзину');
  }
})


emitter.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
});


emitter.on('card:remove', (item: IProduct) => {
  appData.removeProductToBasket(item);
  appData.removeFromOrder(item);
  emitter.emit('basket:updateCounter');
  emitter.emit('basket:change');
});

emitter.on('basket:change', () => {
  basket.setDisabled(basket.button, appData.statusBasket);
  basket.total = appData.getTotal();
  let i = 1;
  basket.items = appData.bskt.map((item) => {
    const card = new CardBasket(cloneTemplate(cardBasketTpl), {
      onClick: () => emitter.emit('card:remove', item)
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: i++
    });
  });
});

emitter.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone, address, payment } = errors;
  order.valid = !address && !payment;
  contacts.valid = !email && !phone;
  order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

emitter.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setContactsField(data.field, data.value);
});

emitter.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

emitter.on('payment:change', (item: HTMLButtonElement) => {
  appData.order.payment = item.name;
})

emitter.on('order:open', () => {
  modal.render({
    content: order.render({
      address: '',
      payment: 'card',
      valid: false,
      errors: []
    })
  });
});

emitter.on('order:submit', () => {
  appData.order.total = appData.getTotal()
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  });
})

emitter.on('contacts:submit', () => { 
  api.orderProducts(appData.order) 
    .then((result) => { 
      console.log(appData.order);
      modal.render({ 
        content: success.render({ 
          total: appData.getTotal() 
        }) 
      }); 
      emitter.emit('basket:clear')
    }) 
    .catch(err => { 
      console.error(err); 
    });
}); 

emitter.on('modal:open', () => {
    page.locked = true;
});

emitter.on('modal:close', () => {
    page.locked = false;
});

api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
});
