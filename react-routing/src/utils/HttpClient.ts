
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private signal?: AbortSignal;

  constructor(configs: AxiosRequestConfig, signal?: AbortSignal) {
    this.axiosInstance = axios.create({
      baseURL: configs.baseURL,
      timeout: configs.timeout || 3000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...configs.headers,
      },
      ...configs,
    });

    this.signal = signal;

    this.initInterceptors();
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  public async post<T, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  public async put<T, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        ...config,
        signal: this.signal,
      });

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.info('Request was cancelled');
      } else if (error instanceof AxiosError) {
        console.error('Request failed with error', error.response?.statusText);
      } else {
        console.error('Unexpected error occurred', (error as Error).message);
      }

      return Promise.reject(error);
    }
  }

  private initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const apiKey =
          localStorage.getItem("apiKey") ?? "SrFeARsHHeiM2kaAABFGnnlk6Tgu4Wzt";

        if (apiKey) {
          config.params = { ...config.params, "api-key": apiKey };
        }


        return config;
      },
      (error) => {
        console.error("Request failed with error", error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          console.error('Unauthorized request');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}
