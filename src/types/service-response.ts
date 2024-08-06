export type TServiceResponse = {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: any[];
};
