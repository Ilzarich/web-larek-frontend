# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка товара 
```
export interface ICard {
    _id: string;
    description: string;
    image: string;
    title: string
    category: string;
    price: string;
}
```

Пользователь 

```
export interface IUser { 
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: string;
    items: string;
}
```

Корзина 
```
export interface IBasket extends ICard, IUser{
    title: string;
    price: string;
    total: string;
}
```

Интерфейс для модели данных карточек

```
export interface ICardsData {
    cards: ICard[]; // Берем массив карточек
    preview: string | null; // Чтоб было понять на какаую карточку нажали на сайте
 }
```

Данные карточки используемые для отображения в массиве 
```
export type TCardInfo = Pick<ICard, 'title' | 'category' | 'price'>;
```

Данные карточки, используемые в моадльном окне при просмотре карточки
```
export type TCardModal = Pick<ICard, 'category' | 'title' | 'description'| 'price'>;
```

Даннеы корзины, используемые при просмотри корзины
```
export type TModalBasket = Pick<IBasket, 'title' | 'price' | 'total'>;
```

Данные пользователя, используемые при офрормлении заказа а именно форма оплаты и адресс доставки
```
export type TModalOrder = Pick<IUser, 'payment' | 'address'>;
```

Данные пользователя, используемые при офрормлении заказа а именно почта и телефон
```
export type TModalData = Pick<IUser, 'email' | 'phone'>
```

Данные пользователя, используемые в попапе после оформления заказа а именно сколько всего было потрачено средств
```
export type TModalTotalOrder = Pick<IUser, 'total'>
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс CardData 

Класс отвечает за отображение карточек на странице\
Конструктор класса принимает инстант брокера событий\
- `preview: string | null` - id карточки, выбранной для просмотра в модальной окне.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- ` deleteCardsBasket(cardId: string, payload: Function | null): void;` - метод позволяет удалять карточки товара выбраные пользователем в корзине. 

#### Класс OrderData 
Класс отвечает за проверку введенных данных пользователем в поле оформления заказа\ 
Так же класс предоставляет набор методов для взаимодействия с этими данными.
- `checkValidationOrder(data: Record<keyof TModalOrder, string>):boolean;` - метод позволяет отслеживать первую часть оформления заказа на валидность 
- `checkValidationData(data: Record<keyof TModalData, string>):boolean;` - метод позволяет отслеживать вторую часть оформления заказа на валидность 

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalWithConfirm
Расширяет класс Modal. Предназначен для реализации модального окна подтверждения. При открытии модального окна сохраняет полученный в параметрах обработчик, который передается для выполнения при сабмите формы.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка оформления заказа
- _form: HTMLFormElement - элемент формы

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `сard:open` - открытие модального окна с товаром
- `card:select` - выбор товара для отображения в модальном окне
- `cardBasket:delete` - выбор товара для удаления из корзины 
- `onlineBasketOne:validation` - событие, сообщающее о необходимости валидации первой формы
- `onlineBasketTwo:validation` - событие, сообщающее о необходимости валидации второй формы