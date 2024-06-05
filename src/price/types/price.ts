export type TRequestPrice = {
  refMarket: string;
  startDate: string;
  endDate: string;
};

export type TDurianPrice = {
  status: 'success' | 'error';
  message?: string;
  data: IDurianData[];
};

export interface IDurianData {
  name: string;
  description: string;
  imageUrl: string;
  subProducts: ISubProduct[];
  resources: unknown[];
  resourceDetails: IResourceDetail[];
  prices: IPrice[];
  fromDate: string;
  toDate: string;
  id: number;
  enable: boolean;
}

export interface ISubProduct {
  name: string;
  description: string;
  unit: string;
  ranking: number;
  product: null | string;
  id: number;
  enable: boolean;
}

export interface IResourceDetail {
  name: string;
  description: string;
  webSite: string;
  address: string;
  province: string;
  latitude: string;
  longitude: string;
  resources: unknown[];
  id: number;
  enable: boolean;
}

export interface IPrice {
  subProductId: number;
  priceDate: string;
  avgPrice: number;
}
