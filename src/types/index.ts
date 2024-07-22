// Карточка товара 
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

// Каталог товаров  
export interface IProductList {
    total: number;
    items: IProductItem[];
}

// Модальное окно форма оплаты  и адресса 
export interface IAddressForm {
    payment: 'online' | 'upon receipt';
    address: string;
}

// Модальное окно форма контактов
export interface IContactForm { 
    mail: string;
    phone: number;
}

// Модальное окно после оформления заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Тип данных с ошибкой в адресе доставки 
export type AddressFormError = Partial<Record<keyof IAddressForm, string>>;

// Тип данных с ошибкой в контактах
export type ContactFormError = Partial<Record<keyof IContactForm, string>>;




//
export interface IError {
    error: string;
}
