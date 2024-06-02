// Карточка товара 
export interface ICard {
    _id: string;
    description: string;
    image: string;
    title: string
    category: string;
    price: number;
}

// Пользователь
export interface IUser { 
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string;
}

// Интерфейс корзины
export interface IBasket extends ICard, IUser {
    title: string;
    price: number;
    total: number;
    deleteBasketCard(card: ICard, payload: Function | null): void
    changeTotal(total: number, payload: Function | null):void;
}

// Интерфейс взаимодействия с карточкой
export interface ICardData {
    cards: ICard[];
    preview: string | null;
    addBasket(cardId: string, payload: Function | null):void;
}



// Тип карточки товора 
export type TCardInfo = Pick<ICard, 'category' | 'title' | 'image' | 'price'>;

// Тип картчоки товара в модалном окне

export type TCardModalInfo = Pick<ICard, 'image' | 'category' | 'title' | 'description' | 'price'>;

// Тип данных в модалке корзины 

export type TBasketInfo = Pick<IBasket, 'title' | 'price' | 'title'>;

// Тип данных в модальном окне оформления заказа способ оплаты и адрес

export type TModalOrderPayment = Pick<IUser, 'payment' | 'address'>;

// Тип данных в модальном окне офрмления заказа почта и телефон

export type TModalOrderData = Pick<IUser, 'email' | 'phone'>;

// Тип данных в модальном окне после оформления заказа

export type TModalВecorated = Pick<IUser, 'total'>


export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


