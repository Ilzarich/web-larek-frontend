// Карточка товара 

export interface ICard {
    _id: string;
    description: string;
    image: string;
    title: string
    category: string;
    price: string;
}

// Пользователь

export interface IUser { 
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: string;
    items: string;
}

// Корзина 

export interface IBasket extends ICard, IUser{
    title: string;
    price: string;
    total: string;
}

// Интерфейс в котором будет храниться карточки в корзине после добавления

export interface IBasketData { 
    preview: string | null // Будем отслеживать какие карточки поместили в корзину 
    deleteCardsBasket(cardId: string, payload: Function | null): void; // метод удаления карточки из корзины 
}

export interface IOrderCheck { 
    checkValidationOrder(data: Record<keyof TModalOrder, string>):boolean; // отслеживаем на валидность первую часть оформления 
    checkValidationData(data: Record<keyof TModalData, string>):boolean; // отслеживаем на валидность вторую часть оформления
}

// Типы данных 

export type TCardInfo = Pick<ICard, 'title' | 'category' | 'price'>;

export type TCardModal = Pick<ICard, 'category' | 'title' | 'description'| 'price'>;

export type TModalBasket = Pick<IBasket, 'title' | 'price' | 'total'>;

export type TModalOrder = Pick<IUser, 'payment' | 'address'>;

export type TModalData = Pick<IUser, 'email' | 'phone'>

export type TModalTotalOrder = Pick<IUser, 'total'>