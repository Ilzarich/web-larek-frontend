import { FormErrors, IAppState, IProduct, IOrder, IOrderForm, IProductItem } from "../types";
import { Model } from "./base/Model";

export class AppData extends Model<IAppState> {
  catalog: IProduct[];
  preview: string;
  basket: IProduct[] = [];
  order: IOrder = {
    address: '',
    payment: 'card',
    email: '',
    total: 0,
    phone: '',
    items: []
  };
  formErrors: FormErrors = {};
  totalSpent: number = 0;

  clearBasket() {
    this.totalSpent = this.getTotal();
    this.basket = []
    this.order.items = []

  }

  addToOrder(item: IProduct) {
    if(item.price !== null) {
      this.order.items.push(item.id);
    } else {
      this.events.emit('Невозможно добавить товар без цены в корзину')
    }
  }
  
  removeFromOrder(item: IProduct) {
    const index = this.order.items.indexOf(item.id);
    if (index >= 0) {
      this.order.items.splice( index, 1 );
    }
  }

  setCatalog(items: IProductItem[]) {
    this.catalog = items.map(item => ({...item} as IProduct));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  setProductToBasket(item: IProduct) {
    if(item.price !== null){
      this.basket.push(item)
    }
  }

  removeProductToBasket(item: IProduct) {
    const index = this.basket.indexOf(item);
    if (index >= 0) {
      this.basket.splice( index, 1 );
    }
  }

  get statusBasket(): boolean {
    return this.basket.length === 0
  }
  
  get bskt(): IProduct[] {
    return this.basket
  }

  set total(value: number) {
    this.order.total = value;
  }

  getTotal() {
    return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validationOrder()) {
        this.events.emit('order:ready', this.order);
    } 
  }
  setContactsField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validationContacts()) {
        this.events.emit('order:ready', this.order);
    } 
  }

  validationOrder() {
      const errors: typeof this.formErrors = {};
      
      if (!this.order.address) {
        errors.address = 'Необходимо указать адресс';
      }
      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
  }

  validationContacts() {
      const errors: typeof this.formErrors = {};
      if (!this.order.email) {
          errors.email = 'Необходимо указать email';
      }
      if (!this.order.phone) {
          errors.phone = 'Необходимо указать телефон';
      }
      
      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
  }
}