import { IOrder, IOrderResult, IProductItem } from "../types";
import { Api, ApiListResponse} from "./base/api";

export class LarekApi extends Api {
  cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options)
    this.cdn = cdn;
  }
  getProductList() {
    return this.get('/product')
      .then((data: ApiListResponse<IProductItem>) => {
        return data.items.map((item) => ({ ...item }))
      })
  }
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
        (data: IOrderResult) => data
    );
  }
}