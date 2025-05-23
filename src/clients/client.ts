/* eslint @typescript-eslint/no-explicit-any: off */
import axios, { AxiosInstance } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

export default class Client {
  public readonly instance: AxiosInstance;

  public constructor() {
    // const baseURL = 'http://localhost:8080'
    const baseURL = 'https://api.felipecisotto.com.br/financial'
    this.instance = axios.create({ baseURL });
    this.instance.interceptors.request.use((options) => {
      const nConfig = { ...options };
      if (options.params) {
        nConfig.params = decamelizeKeys(options.params);
      }
      if (options.data) {
        nConfig.data = decamelizeKeys(options.data);
      }
      return nConfig;
    });
    this.instance.interceptors.response.use((options) => {
      const response = { ...options };
      if (options.data) {
        response.data = camelizeKeys(response.data);
      }
      return response;
    });
  }
}
