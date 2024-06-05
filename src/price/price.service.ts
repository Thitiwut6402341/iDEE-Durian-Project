import axios from 'axios';
import { TDurianPrice, TRequestPrice } from './types/price';

export class PriceService {
  async getPrices(requestPrice: TRequestPrice): Promise<TDurianPrice> {
    const { data: res } = await axios.get(
      `https://kasetpricev2.azurewebsites.net/api/product/getByNameIncludePrices/%E0%B8%97%E0%B8%B8%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99/resourceDetail/${requestPrice?.refMarket}?from=${requestPrice?.startDate}&to=${requestPrice?.endDate}`,
    );
    const formattedData: TDurianPrice = {
      status: "success",
      message: 'Get prices successfully',
      data: [res?.data] || [],
    };
    return formattedData;
  }
}
